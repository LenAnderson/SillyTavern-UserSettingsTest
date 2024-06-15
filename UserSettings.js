import { delay } from "../../../utils.js";

/**
 * @typedef {object} UserSettingsItem
 * @prop {string} name
 * @prop {(HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement|HTMLElement)[]} inp
 * @prop {string} description
 * @prop {string} type
 * @prop {HTMLElement[]} buttons
 * @prop {HTMLElement[]} icons
 */
export class UserSettings {
    // controls:
    //  - buttons (one or more)
    //  - select (optional with buttons)
    //  - color
    //  - range (with input)
    //  - checkbox
    //  - double range (with labels)
    //  - textarea (with expand)
    // icons:
    //  - experimental
    //  - doclink
    //  - mobile-only
    //  - desktop-only
    //  - action (!) -> should probably just be a button

    tree;

    constructor() {
        this.init();
        window.addEventListener('keydown', async(evt)=>{
            if (evt.ctrlKey && evt.key == ',') {
                document.querySelector('#user-settings-button .drawer-icon').click();
                await delay(500);
                this.updateCategory();
                document.querySelector('#user-settings-v2-search').select();
            }
            if (!document.querySelector('[data-user-settings="user-settings-v2-block"]').classList.contains('openDrawer')) return;
            if (evt.ctrlKey && evt.key == 'f') {
                evt.preventDefault();
                evt.stopPropagation();
                document.querySelector('#user-settings-v2-search').select();
            }
        });
        document.querySelector('#user-settings-v2-search').addEventListener('input', ()=>{
            const query = document.querySelector('#user-settings-v2-search').value.trim().toLowerCase();
            const items = [...document.querySelectorAll('[data-user-settings="user-settings-v2-block"] .contentWrapper .item')];
            for (const item of items) {
                if (item.textContent.toLowerCase().includes(query)) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            }
            const cats = [...document.querySelectorAll('[data-user-settings="user-settings-v2-block"] .contentWrapper .category:has(.item:not(.hidden)) .head')].map(it=>it.textContent);
            const heads = [...document.querySelectorAll('[data-user-settings="user-settings-v2-block"] .categoriesWrapper .category .head')];
            for (const head of heads) {
                if (cats.includes(head.textContent)) {
                    head.classList.remove('hidden');
                } else {
                    head.classList.add('hidden');
                }
            }
            this.updateCategory();
        });
        document.querySelector('[data-user-settings="user-settings-v2-block"] .contentWrapper').addEventListener('scroll', ()=>{
            this.updateCategory();
        });
    }

    updateCategory() {
        const items = [...document.querySelectorAll('[data-user-settings="user-settings-v2-block"] .contentWrapper .item')];
        for (const item of items) {
            const rect = item.getBoundingClientRect();
            if (rect.top > 0) {
                const cat = item.closest('.category').querySelector('.head').textContent;
                const heads = [...document.querySelectorAll('[data-user-settings="user-settings-v2-block"] .categoriesWrapper .head')];
                for (const head of heads) {
                    if (head.textContent == cat) {
                        let cur = head;
                        cur.classList.add('current');
                        while (cur) {
                            cur = cur.closest('.category').parentElement.closest('.category')?.querySelector('.head');
                            cur?.classList?.add('current');
                        }
                    } else {
                        head.classList.remove('current');
                    }
                }
                return;
            }
        }
    }

    init() {
        const nameMap = {
            'themes': 'Theme',
            'ui_preset_import_file': 'Import Theme',
            'chat_display': 'Chat Display',
            'auto_swipe_blacklist': 'Blacklisted words',
            'stscript_autocomplete_font_scale': 'Font Scale',
            'debug_menu': 'Debug Menu',
            'reload_chat': 'Reload Chat',
            'ui_mode_select': 'UI Mode',
        };
        const descMap = {
            'themes': 'Select a UI theme',
            'avatar_style': 'Specify how avatars are displayed',
            'chat_display': 'Specify how the chat messages are displayed',
            'main-text-color-picker': 'Default text color for UI and chat messages',
            'italics-color-picker': 'Text color for italics in chat messages',
            'underline-color-picker': 'Text color for underlined text in chat messages',
            'quote-color-picker': 'Text color for quoted text in chat messages',
            'shadow-color-picker': 'Color for text shadows in UI and chat messages',
            'chat-tint-color-picker': 'Background color for the chat area',
            'blur-tint-color-picker': 'Background color for UI elements (panels, popups, ...)',
            'border-color-picker': 'Border color for UI elements (panels, popups, ...)',
            'user-mes-blur-tint-color-picker': 'Background color for user written chat messages',
            'bot-mes-blur-tint-color-picker': 'Background color for AI written chat messages',
            'stscript_autocomplete_autoHide': 'Automatically hide autocomplete details when typing after completion',
            'debug_menu': 'Open a menu with debugging tools',
            'account_button': 'Manage your account',
            'admin_button': 'Administer all accounts and create new accounts',
            'logout_button': 'Logout of your account',
            'ui_mode_select': '"Simple" hides some settings from you',
            'ui_language_select': 'Select a UI translation',
            // 'example_messages_behavior': '',
            // 'send_on_enter': '',
            // 'continue_on_send': '',
            // 'auto-load-chat-checkbox': '',
            // 'auto_scroll_chat_to_bottom': '',
            // 'confirm_message_delete': '',
            // 'auto_fix_generated_markdown': '',
            // 'allow_name2_display': '',
            // 'allow_name1_display': '',
            // 'console_log_prompts': '',
        };
        const catMap = {
            'Custom CSS > ': 'UI Theme',
        };
        const catCrumbsMap = {
            'account_button': 'User Management',
            'admin_button': 'User Management',
            'logout_button': 'User Management',
            'ui_mode_select': 'Miscellaneous',
            'ui_language_select': 'Miscellaneous',
        };
        const btnMap = {
            'themes': [
                '#ui-preset-update-button',
                '#ui-preset-save-button',
                '#ui_preset_import_button',
                '#ui_preset_export_button',
                '#ui-preset-delete-button',
            ],
            'movingUIPresets': [
                '#movingui-preset-save-button',
                '#movingUIreset',
            ],
            'bogus_folders': [
                'label[for="bogus_folders"] .tags_view',
            ],
            'customCSS': [
                '#CustomCSS-block .editor_maximize',
                '.csss--trigger',
            ],
        };
        const skipList = [
            'smooth_streaming_speed',
            'ui_preset_import_file',
        ];
        const settingsRoot = document.querySelector('#user-settings-block-content');
        const toOldBtn = document.createElement('div'); {
            toOldBtn.classList.add('menu_button');
            toOldBtn.textContent = 'Old Settings';
            toOldBtn.style.whiteSpace = 'nowrap';
            toOldBtn.addEventListener('click', ()=>{
                const wrapper = document.querySelector('#user-settings-v2-wrapper');
                wrapper.classList.add('hidden');
                [...wrapper.parentElement.children].filter(it=>it != wrapper).forEach(it=>it.style.display = '');
            });
        }
        const tree = {};
        let prevSetting;
        const inps = [
            ...settingsRoot.querySelectorAll('select, input, textarea, toolcool-color-picker, #reload_chat, #debug_menu'),
            ...document.querySelectorAll('#account_button, #admin_button, #logout_button, #ui_mode_select, #ui_language_select'),
        ];
        for (const inp of inps) {
            if (skipList.includes(inp.id)) continue;
            let prefix = '';
            if (catCrumbsMap[inp.id]) {
                prefix = catCrumbsMap[inp.id];
            } else {
                let header = inp.closest('[name="UserSettingsFirstColumn"], [name="UserSettingsSecondColumn"], [name="UserSettingsThirdColumn"]').querySelectorAll(`h4, #${inp.id}`);
                let prev;
                for (const h of header) {
                    if (h == inp) break;
                    prev = h;
                }
                if (prev) {
                    prefix = `${prefix}${prev.textContent.trim()} > `;
                }
                const drawer = inp.closest('.inline-drawer')?.querySelector('.inline-drawer-header')?.firstElementChild?.textContent?.replace(/^[\s\n]*([^\n]+).*$/s, '$1').trim();
                if (drawer) {
                    prefix = `${prefix}${drawer} > `;
                }
            }
            const name = (
                null
                || nameMap[inp.id]
                || (inp.previousElementSibling?.hasAttribute('data-i18n') ? inp.previousElementSibling.textContent.trim() : null)
                || (inp.nextElementSibling?.hasAttribute('data-i18n') ? inp.nextElementSibling.textContent.trim() : null)
                || (inp.closest('.range-block')?.querySelector(':not(option)[data-i18n]')?.textContent?.trim())
                || (inp.id && (document.querySelector(`label[for="${inp.id}"]`)?.children?.length ?? -1) == 0 ? document.querySelector(`label[for="${inp.id}"]`).textContent.trim() : null)
                || (inp.closest('label')?.querySelector(':not(option)[data-i18n]')?.textContent?.trim() ?? null)
                || inp.closest(':has(:not(option)[data-i18n])').querySelector(':not(option)[data-i18n]')?.textContent
                // || (inp.id ? settingsRoot.querySelector(`label[for="${inp.id}"]`)?.getAttribute('data-i18n') : null)
                // || inp.closest('label')?.querySelector('[data-i18n]').getAttribute('data-i18n')
                || inp.name
                || inp.id
            ).replace(/^([^\n]+)[\s\S]*$/s, '$1').replace(/:\s*$/, '').trim();
            const crumbs = (catMap[prefix] ?? prefix).split(' > ');
            let cur = tree;
            for (const c of crumbs) {
                if (c == '') continue;
                if (!cur[c]) cur[c] = { name:c, settings:[] };
                cur = cur[c];
            }
            let description = (
                null
                || descMap[inp.id]
                || inp.getAttribute('title')
                || inp.getAttribute('data-sttt--title')
                || inp.getAttribute('placeholder')
                || inp.closest('[title], [data-sttt--title]')?.getAttribute('title')
                || inp.closest('[title], [data-sttt--title]')?.getAttribute('data-sttt--title')
                || inp.closest(':has([title], [data-sttt--title])').querySelector('[title], [data-sttt--title]')?.getAttribute('title')
                || inp.closest(':has([title], [data-sttt--title])').querySelector('[title], [data-sttt--title]')?.getAttribute('data-sttt--title')
                || '...'
            );
            if (description == 'The number of chat history messages to load before pagination.' && inp.id != 'chat_truncation' && inp.id != 'chat_truncation_counter') {
                description = '...';
            }
            const buttons = (btnMap[inp.id] ?? []).map(it=>document.querySelector(`${it}`)).filter(it=>it);
            buttons.forEach(it=>{
                it.replaceWith(it.cloneNode(true));
                it.classList.add('menu_button');
            });
            const icons = [...((
                null
                || (inp.previousElementSibling?.hasAttribute('data-i18n') ? inp.previousElementSibling : null)
                || (inp.nextElementSibling?.hasAttribute('data-i18n') ? inp.nextElementSibling : null)
                || (inp.closest('.range-block')?.querySelector(':not(option)[data-i18n]'))
                || (inp.id && (document.querySelector(`label[for="${inp.id}"]`)?.children?.length ?? -1) == 0 ? document.querySelector(`label[for="${inp.id}"]`) : null)
                || (inp.closest('label')?.querySelector(':not(option)[data-i18n]') ?? null)
                || inp.closest(':has(:not(option)[data-i18n])').querySelector(':not(option)[data-i18n]')
                // || (inp.id ? settingsRoot.querySelector(`label[for="${inp.id}"]`)?.getAttribute('data-i18n') : null)
                // || inp.closest('label')?.querySelector('[data-i18n]').getAttribute('data-i18n')
            )?.parentElement.querySelectorAll('.fa-solid:not(.fa-circle-info)') ?? [])]
                .filter(it=>!it.closest('.menu_button, .right_menu_button'))
                .map(it=>it.closest('a') ?? it)
            ;
            icons.forEach(it=>it.replaceWith(it.cloneNode(true)));
            if (inp.classList.contains('neo-range-input')) {
                prevSetting.inp.push(inp);
                prevSetting.type = 'neo-range';
                const clone = inp.cloneNode(true);
                clone.id += '_';
                inp.replaceWith(clone);
            } else if (inp.closest('.doubleRangeContainer')) {
                const inpC = inp.closest('.doubleRangeContainer');
                if (prevSetting.inp[0] != inpC) {
                    prevSetting = { name, inp:[inpC], description, type:'doubleRangeContainer', buttons, icons };
                    cur.settings.push(prevSetting);
                } else {
                    const clone = inpC.cloneNode(true);
                    clone.id += '_';
                    inpC.replaceWith(clone);
                }
            } else {
                prevSetting = { name, inp:[inp], description, type:inp.type ?? inp.tagName, buttons, icons };
                cur.settings.push(prevSetting);
                const clone = inp.cloneNode(true);
                clone.id += '_';
                inp.replaceWith(clone);
            }
        }
        tree['Settings'] = {
            name: 'Settings',
            settings: [
                {
                    name: 'Show old user settings',
                    inp: [toOldBtn],
                    description: 'Show old user settings (not functional)',
                    type:'button',
                    buttons: [],
                    icons: [],
                },
            ],
        };
        console.log('SETTINGS', tree);
        this.tree = tree;

        const catRoot = document.querySelector('[data-user-settings="user-settings-v2-block"] .categoriesWrapper');
        const contentRoot = document.querySelector('[data-user-settings="user-settings-v2-block"] .contentWrapper');
        const render = (cat, cont, cur, level = 0)=>{
            for (const key of Object.keys(cur)) {
                if (['name', 'settings'].includes(key)) continue;
                const curCat = cur[key];
                const block = document.createElement('div'); {
                    block.classList.add('category');
                    const head = document.createElement('div'); {
                        head.classList.add('head');
                        head.setAttribute('data-level', level.toString());
                        head.textContent = key;
                        block.append(head);
                    }
                }
                const catBlock = block.cloneNode(true);
                catBlock.querySelector('.head').addEventListener('click', ()=>{
                    const top = block.querySelector('.item').offsetTop;
                    const head = block.querySelector('.head');
                    const headStyle = window.getComputedStyle(head);
                    const offset = Number(headStyle.top.slice(0,-2)) + Number(head.offsetHeight);
                    contentRoot.scrollTo({
                        top: block.offsetTop - offset,
                        behavior: 'smooth',
                    });
                });
                cat.append(catBlock);
                cont.append(block);
                for (const setting of curCat.settings) {
                    const item = document.createElement('div'); {
                        item.classList.add('item');
                        const head = document.createElement('div'); {
                            head.classList.add('head');
                            const text = document.createElement('div'); {
                                text.classList.add('text');
                                text.textContent = setting.name;
                                head.append(text);
                            }
                            const key = document.createElement('small'); {
                                key.textContent = setting.inp.map(it=>`#${it.id}`).join(', ');
                                key.style.fontWeight = 'normal';
                                head.append(key);
                            }
                            const icons = document.createElement('div'); {
                                icons.classList.add('icons');
                                icons.append(...setting.icons);
                                head.append(icons);
                            }
                            item.append(head);
                        }
                        switch (setting.type) {
                            case 'neo-range': {
                                const desc = document.createElement('div'); {
                                    desc.classList.add('description');
                                    desc.textContent = setting.description;
                                    item.append(desc);
                                }
                                const wrap = document.createElement('div'); {
                                    wrap.classList.add('neo-range-wrap');
                                    wrap.append(...setting.inp);
                                    item.append(wrap);
                                }
                                break;
                            }
                            case 'checkbox': {
                                const lbl = document.createElement('label'); {
                                    lbl.classList.add('checkboxLabel');
                                    lbl.append(...setting.inp);
                                    const desc = document.createElement('div'); {
                                        desc.classList.add('description');
                                        desc.textContent = setting.description;
                                        lbl.append(desc);
                                    }
                                    item.append(lbl);
                                }
                                break;
                            }
                            case 'TOOLCOOL-COLOR-PICKER': {
                                const lbl = document.createElement('label'); {
                                    lbl.classList.add('colorLabel');
                                    lbl.append(...setting.inp);
                                    lbl.addEventListener('pointerdown', ()=>{
                                        if (!setting.inp[0].state.isPopupVisible) {
                                            setting.inp[0].toggle();
                                        }
                                    });
                                    const desc = document.createElement('div'); {
                                        desc.classList.add('description');
                                        desc.textContent = setting.description;
                                        lbl.append(desc);
                                    }
                                    item.append(lbl);
                                }
                                break;
                            }
                            default: {
                                const desc = document.createElement('div'); {
                                    desc.classList.add('description');
                                    desc.textContent = setting.description;
                                    item.append(desc);
                                }
                                item.append(...setting.inp);
                                break;
                            }
                        }
                        if (setting.buttons?.length) {
                            const actions = document.createElement('div'); {
                                actions.classList.add('actions');
                                actions.append(...setting.buttons);
                                item.append(actions);
                            }
                        }
                        block.append(item);
                    }
                }
                render(catBlock, block, curCat, level + 1);
            }
        };
        render(catRoot, contentRoot, tree);
        this.updateCategory();
    }
}
