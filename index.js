import { delay } from '../../../utils.js';
import { UserSettings } from './UserSettings.js';

/**@type {UserSettings} */
export let us;
const init = async()=>{
    const response = await fetch('/scripts/extensions/third-party/SillyTavern-UserSettings/drawer.html', { cache: 'no-store' });
    if (response.ok) {
        const template = document.createRange().createContextualFragment(await response.text()).querySelector('#user-settings-v2-button');
        const dom = /**@type {HTMLElement}*/(template.cloneNode(true));
        // document.querySelector('#user-settings-button').insertAdjacentElement('afterend', dom);
        for (const el of document.querySelector('#user-settings-block').children) el.style.display = 'none';
        document.querySelector('#user-settings-block').append(dom.querySelector('.wrapper'));
        document.querySelector('#user-settings-block').setAttribute('data-user-settings', 'user-settings-v2-block');
        document.querySelector('#user-settings-block').parentElement.addEventListener('pointerdown', async(evt)=>{
            if (evt.target.classList.contains('drawer-icon')) {
                await delay(500);
                us.updateCategory();
                document.querySelector('#user-settings-v2-search').select();
            }
        });
        const toNewBtn = document.createElement('div'); {
            toNewBtn.classList.add('menu_button');
            toNewBtn.textContent = 'New Settings';
            toNewBtn.title = 'Switch to new settings';
            toNewBtn.style.whiteSpace = 'nowrap';
            toNewBtn.addEventListener('click', ()=>{
                const wrapper = document.querySelector('#user-settings-v2-wrapper');
                wrapper.classList.remove('hidden');
                [...wrapper.parentElement.children].filter(it=>it != wrapper).forEach(it=>it.style.display = 'none');
            });
            document.querySelector('#ui_mode_select').insertAdjacentElement('afterend', toNewBtn);
        }
        // const toggle = dom.querySelector('.drawer-icon');
        // const drawer = dom.querySelector('.drawer-content');
        // toggle.addEventListener('pointerdown', async(evt)=>{
        //     evt.stopPropagation();
        //     evt.stopImmediatePropagation();
        //     document.querySelector('.drawer-icon.openIcon')?.click();
        //     toggle.classList.toggle('closedIcon');
        //     toggle.classList.toggle('openIcon');
        //     drawer.classList.toggle('closedDrawer');
        //     const isOpen = drawer.classList.toggle('openDrawer');
        //     drawer.style.display = '';
        //     if (isOpen) {
        //         await delay(100);
        //         document.querySelector('#user-settings-v2-search').select();
        //         us.updateCategory();
        //     }
        // });
        us = new UserSettings();
    }
};
await init();
