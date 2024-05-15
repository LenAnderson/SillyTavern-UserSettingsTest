import { delay } from '../../../utils.js';
import { UserSettings } from './UserSettings.js';

const init = async()=>{
    const response = await fetch('/scripts/extensions/third-party/SillyTavern-UserSettings/drawer.html', { cache: 'no-store' });
    if (response.ok) {
        const template = document.createRange().createContextualFragment(await response.text()).querySelector('#user-settings-v2-button');
        const dom = /**@type {HTMLElement}*/(template.cloneNode(true));
        document.querySelector('#user-settings-button').insertAdjacentElement('afterend', dom);
        const toggle = dom.querySelector('.drawer-icon');
        const drawer = dom.querySelector('.drawer-content');
        toggle.addEventListener('pointerdown', async(evt)=>{
            evt.stopPropagation();
            evt.stopImmediatePropagation();
            document.querySelector('.drawer-icon.openIcon')?.click();
            toggle.classList.toggle('closedIcon');
            toggle.classList.toggle('openIcon');
            drawer.classList.toggle('closedDrawer');
            const isOpen = drawer.classList.toggle('openDrawer');
            drawer.style.display = '';
            if (isOpen) {
                await delay(100);
                document.querySelector('#user-settings-v2-search').select();
            }
        });
        new UserSettings();
    }
};
await init();
