import {
    Plugin,
    openTab,
    adaptHotkey,
    Setting
} from "siyuan";
import "./index.scss";

const Homepageid = "Homepageid";
const note = "note";
const pageallopen = "pageallopen";
const pagealwaysopen = "pagealwaysopen";
// const pagewindowsopen = "pagewindowsopen";
// const TAB_TYPE = "custom_tab";
const DOCK_TYPE = "dock_tab";

export default class Homepage extends Plugin {
    [x: string]: any;

    async openTabById() {
        const id = await this.loadData(Homepageid);
        const how = await this.loadData(pageallopen);
        const lines = id.iddata.split("\n"); // 拆分多行文本为数组
        // const window = await this.loadData(pagewindowsopen);

        if (how === "open") {
            const firstLine = lines[0].trim(); // 获取第一行的id
                openTab({
                    app: this.app,
                    doc: {
                        id: firstLine
                    }
                });
        } else if (id) {
            for (const line of lines) {
                const trimmedLine = line.trim(); // 去除行首尾的空格
                    openTab({
                        app: this.app,
                        doc: {
                            id: trimmedLine
                        }
                    });
            }
        }
    }

    async openTabByIdalways() {
        const id = await this.loadData(Homepageid);
        const how = await this.loadData(pageallopen);
        const is = await this.loadData(pagealwaysopen);
        const lines = id.iddata.split("\n"); // 拆分多行文本为数组
        const keepCursor = true;
        if (is === "open") {

            if (how === "open") {
                const firstLine = lines[0].trim(); // 获取第一行的id
                    openTab({
                        app: this.app,
                        doc: {
                            id: firstLine
                        },
                        keepCursor: keepCursor
                    });
            } else if (id) {
                for (const line of lines) {
                    const trimmedLine = line.trim(); // 去除行首尾的空格
                        openTab({
                            app: this.app,
                            doc: {
                                id: trimmedLine
                            },
                            keepCursor: keepCursor
                        });
                }
            }
        }
    }


    async onLayoutReady() {
        this.openTabById();
    }

    async onload() {

        this.openTabById();
        try {
            const notev = await this.loadData(note);
            this.data[note].notedata = notev.notedata;
          } catch (error) {
            this.data[note] = {notedata: ""};
          }

          try {
            const Homepageidv = await this.loadData(Homepageid);
            this.data[Homepageid].iddata = Homepageidv.iddata;
          } catch (error) {
            this.data[Homepageid] = {iddata: ""};
          }
        const textareaElement = document.createElement("textarea");
        const noteElement = document.createElement("textarea");
        this.addIcons(`<symbol id="HOME" viewBox="0 0 1024 1024">
        <path d="M562.9 80.9C535.4 56 493.5 56 466 80.9L74 453.1c-14.7 13.5-15.7 36.4-2.2 51.1 13.3 14.5 35.8 15.7 50.6 2.6l6.2-5.9v388.4c0 39.9 32.3 72.4 72.2 72.4h210.5V744c0-28.1 22.7-50.9 50.8-51h99.1c28.1 0 50.9 22.8 50.9 50.9V961.7h215.4c39.9 0 72.3-32.4 72.3-72.3V505.7c16.1 14.5 38.9 13.4 52.2-1.5 13.4-14.8 12.2-37.7-2.6-51.1L562.9 80.9z" fill="#ff001a"></path>
        </symbol>
        <symbol id="iconHouse" viewBox="0 0 1024 1024">
        <path d="M562.9 80.9C535.4 56 493.5 56 466 80.9L74 453.1c-14.7 13.5-15.7 36.4-2.2 51.1 13.3 14.5 35.8 15.7 50.6 2.6l6.2-5.9v388.4c0 39.9 32.3 72.4 72.2 72.4h210.5V744c0-28.1 22.7-50.9 50.8-51h99.1c28.1 0 50.9 22.8 50.9 50.9V961.7h215.4c39.9 0 72.3-32.4 72.3-72.3V505.7c16.1 14.5 38.9 13.4 52.2-1.5 13.4-14.8 12.2-37.7-2.6-51.1L562.9 80.9z" fill="#ff001a"></path>
</symbol>
`);
               
        this.setting = new Setting({
            confirmCallback: () => {
                this.saveData(Homepageid, { iddata: textareaElement.value });
                this.saveData(note, { notedata: noteElement.value });
            }
        });
        this.setting.addItem({
            title: "首页文档id",
            description: "支持多页签,默认第一个为首页,按下Shift+Enter换行输入新id,一行一个",
            createActionElement: () => {
                textareaElement.className = "b3-text-field fn__block ids";
                textareaElement.placeholder = "请输入你的首页文档id";
                textareaElement.value = this.data[Homepageid].iddata;
                return textareaElement;
            },
        });
        this.setting.addItem({
            title: "备注框",
            description: "在此可以输入对首页id的备注,方便管理,仅记录文本,无其他作用,按下Shift+Enter换行",
            createActionElement: () => {
                noteElement.className = "b3-text-field fn__block note";
                noteElement.placeholder = "请输入你的备注";
                noteElement.value = this.data[note].notedata;
                return noteElement;
            },
        });
        const btnElement = document.createElement("button");
        btnElement.className = "b3-button b3-button--outline fn__flex-center fn__size200";
        const always = await this.loadData(pageallopen);
        if(always === "open"){
            btnElement.textContent = "当前：开启";
        }else{
            btnElement.textContent = "当前：关闭";
        }
        btnElement.addEventListener("click", () => {
            const storageName = "pageallopen"; // 设置存储名称
            let content = "open"; // 设置默认内容为"open"

            // 检查当前数据状态
            if (btnElement.textContent === "当前：关闭") {
                content = "open"; // 如果当前数据状态为"当前：关闭"，则设置内容为"open"
                btnElement.textContent = "当前：打开"; // 修改按钮文本为"当前：打开"
            } else {
                content = "close"; // 如果当前数据状态为"当前：打开"，则设置内容为"close"
                btnElement.textContent = "当前：关闭"; // 修改按钮文本为"当前：关闭"
            }
            this.saveData(storageName, content); // 调用保存函数
        });

        this.setting.addItem({
            title: "仅自动打开首页",
            description: "关闭时将打开列表里的所有页签",
            actionElement: btnElement,
        });

        const btn2Element = document.createElement("button");
        btn2Element.className = "b3-button b3-button--outline fn__flex-center fn__size200";
        const how = await this.loadData(pagealwaysopen);
        if(how === "open"){
            btn2Element.textContent = "当前：开启";
        }else{
            btn2Element.textContent = "当前：关闭";
        }
        btn2Element.addEventListener("click", () => {
            const storageName = "pagealwaysopen"; // 设置存储名称
            let content = "open"; // 设置默认内容为"open"

            // 检查当前数据状态
            if (btn2Element.textContent === "当前：关闭") {
                content = "open"; // 如果当前数据状态为"当前：关闭"，则设置内容为"open"
                btn2Element.textContent = "当前：打开"; // 修改按钮文本为"当前：打开"
            } else {
                content = "close"; // 如果当前数据状态为"当前：打开"，则设置内容为"close"
                btn2Element.textContent = "当前：关闭"; // 修改按钮文本为"当前：关闭"
            }

            this.saveData(storageName, content); // 调用保存函数
        });

        this.setting.addItem({
            title: "锁定首页打开状态",
            description: "当首页及其他页签被关闭时自动重新打开,开启后还需要点一下首页的dock键开启监听",
            actionElement: btn2Element,
        });

        // const btn3Element = document.createElement("button");
        // btn3Element.className = "b3-button b3-button--outline fn__flex-center fn__size200";
        // btn3Element.textContent = "当前：关闭";
        // btn3Element.addEventListener("click", () => {
        //     const storageName = "pagewindowsopen"; // 设置存储名称
        //     let content = "open"; // 设置默认内容为"open"

        //     // 检查当前数据状态
        //     if (btn3Element.textContent === "当前：关闭") {
        //         content = "open"; // 如果当前数据状态为"当前：关闭"，则设置内容为"open"
        //         btn3Element.textContent = "当前：打开"; // 修改按钮文本为"当前：打开"
        //     } else {
        //         content = "close"; // 如果当前数据状态为"当前：打开"，则设置内容为"close"
        //         btn3Element.textContent = "当前：关闭"; // 修改按钮文本为"当前：关闭"
        //     }

        //     this.saveData(storageName, content); // 调用保存函数
        // });

        // this.setting.addItem({
        //     title: "通过新窗口打开首页",
        //     description: "所有页签通过新窗口打开",
        //     actionElement: btn3Element,
        // });


        this.addDock({
            config: {
                position: "LeftTop",
                size: { width: 200, height: 0 },
                icon: "HOME",
                title: "首页监听",
            },
            data: {
                text: "正在监听"
            },
            type: DOCK_TYPE,
            resize: () => {
                this.openTabByIdalways();
            },
            init() {
                this.element.innerHTML = `<div class="fn__flex-1 fn__flex-column">
    <div class="block__icons">
        <div class="block__logo">
            <svg><use xlink:href="#iconEmoji"></use></svg>
            首页页签监听
        </div>
        <span class="fn__flex-1 fn__space"></span>
        <span data-type="min" class="block__icon b3-tooltips b3-tooltips__sw" aria-label="Min ${adaptHotkey("⌘W")}"><svg><use xlink:href="#iconMin"></use></svg></span>
    </div>
    <div class="fn__flex-1 plugin-sample__custom-dock">
    已开启页签关闭监听,请在设置中选择是否自动恢复关闭的首页页签,开启后点击dock键会打开首页并监听关闭事件
    </div>
</div>`;
            },
            update(){
                console.log("哈哈哈哈");
            },
            destroy() {
                console.log("destroy dock:", DOCK_TYPE);
            }
        });

        this.addCommand({
            langKey: "Homepage",
            hotkey: "⇧⌘H",
            callback: () => {
                console.log("打开首页");
                this.openTabById;
            },
        });

        this.addTopBar({
            icon: "iconHouse",
            title: this.i18n.addTopBarIcon,
            position: "left",
            callback: () => {
                this.openTabById();
            }
        });


    }
}
