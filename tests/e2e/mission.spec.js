import { test, expect } from '@playwright/test';
import { SOLUTION_SQL } from '../../src/mission.js';
import { mkdir } from 'node:fs/promises';

async function enter(page) {
  await page.goto('/');
  await page.getByRole('button', { name:'Aceitar pedido e sair' }).click();
  await page.getByRole('button', { name:'Explorar depósito' }).click();
  await page.locator('[data-action="records"]').click();
  await page.locator('.hotspot[data-action="discover"]').click();
  await page.getByRole('button', { name:'Configurar scanner',exact:true }).click();
}
async function assisted(page) {
  await page.getByRole('button',{name:'Pausar jogo',exact:true}).click();
  await page.locator('#assisted').check();
  await page.getByRole('button',{name:'Continuar jogando'}).click();
}
async function scan(page) {
  await page.getByRole('button',{name:'Preparar varredura'}).click();
  await page.getByRole('button',{name:'Confirmar sinal'}).click();
  await page.reload();
  await expect(page.getByText('Etapa 2 de 2',{exact:false})).toBeVisible();
  await page.getByRole('button',{name:'Confirmar sinal'}).click();
}
test('mobile expedition: wrong cargo, real SQL, resume, return and completion',async ({page})=>{
  await page.setViewportSize({width:360,height:800});
  const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  await enter(page); await assisted(page); await scan(page);
  await expect(page.locator('.feedback')).toContainText('quebrada');
  await page.getByRole('button',{name:'Recolher peças selecionadas'}).click();
  await page.getByRole('button',{name:'Voltar com a carga'}).click();
  await expect(page.getByRole('button',{name:'Instalar lâmpadas e encerrar o dia'})).toHaveCount(0);
  await page.getByRole('button',{name:'Voltar ao depósito'}).click();
  await page.getByRole('button',{name:'Configurar scanner',exact:true}).click();
  await page.locator('#sql').fill(SOLUTION_SQL); await page.reload();
  await expect(page.locator('#sql')).toHaveValue(SOLUTION_SQL);
  await scan(page);
  await page.getByRole('button',{name:'Recolher peças selecionadas'}).click();
  await page.getByRole('button',{name:'Voltar com a carga'}).click();
  await page.getByRole('button',{name:'Instalar lâmpadas e encerrar o dia'}).click();
  await page.getByRole('button',{name:'Pausar jogo',exact:true}).click();
  await page.waitForTimeout(2200);
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('porto-sucata:save:v2')).stage)).toBe('delivery');
  await page.getByRole('button',{name:'Continuar jogando'}).click();
  await expect(page.getByRole('heading',{name:'Feira iluminada!'})).toBeVisible({timeout:10000});
  await expect(page.locator('.world')).toHaveClass(/lit/);
  await page.reload(); await expect(page.getByRole('heading',{name:'Feira iluminada!'})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});
test('timing miss and successful hits, paused signal, syntax and tabs',async ({page})=>{
  await enter(page);
  await page.locator('#sql').fill('SELECT banana FROM pecas;');
  await page.getByRole('button',{name:'Preparar varredura'}).click();
  await expect(page.getByRole('alert')).toContainText('banana');
  await page.getByRole('tab',{name:'Dados',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Catálogo · tabela pecas'})).toBeVisible();
  await page.keyboard.press('ArrowLeft');
  await expect(page.getByRole('tab',{name:'Código',exact:true})).toBeFocused();
  await page.locator('#sql').fill(SOLUTION_SQL);
  await page.getByRole('button',{name:'Preparar varredura'}).click();
  await page.getByRole('button',{name:'Iniciar leitura'}).click();
  await page.getByRole('button',{name:'Fixar sinal'}).click();
  await expect(page.getByRole('status')).toContainText('Quase');
  await page.getByRole('button',{name:'Iniciar leitura'}).click();
  await page.getByRole('button',{name:'Pausar jogo',exact:true}).click();
  const before=await page.locator('#scan-meter').getAttribute('data-position');
  await page.waitForTimeout(300);
  expect(await page.locator('#scan-meter').getAttribute('data-position')).toBe(before);
  await page.getByRole('button',{name:'Continuar jogando'}).click();
  for (const [min,max] of [[35,48],[65,73]]) {
    await page.getByRole('button',{name:'Iniciar leitura'}).focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('button',{name:'Fixar sinal'})).toBeFocused();
    await page.waitForFunction(([min,max])=>{const p=Number(document.querySelector('#scan-meter')?.dataset.position);return p>=min&&p<=max},[min,max]);
    await page.keyboard.press('Enter');
  }
  await expect(page.getByRole('heading',{name:'Leitura concluída'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Leitura concluída'})).toBeFocused();
});
test('capture current desktop and mobile scenes and scanner',async ({page})=>{
  await mkdir('.impeccable/review',{recursive:true});
  await page.setViewportSize({width:1440,height:1050}); await page.goto('/');
  await page.screenshot({path:'.impeccable/review/expedition-desktop.png',fullPage:true});
  await page.getByRole('button',{name:'Aceitar pedido e sair'}).click();
  await page.getByRole('button',{name:'Explorar depósito'}).click();
  await page.screenshot({path:'.impeccable/review/depot-desktop.png',fullPage:true});
  await page.setViewportSize({width:360,height:800});
  await page.screenshot({path:'.impeccable/review/depot-mobile.png',fullPage:true});
  await page.locator('.hotspot[data-action="discover"]').click();
  await page.getByRole('button',{name:'Configurar scanner',exact:true}).click();
  await page.screenshot({path:'.impeccable/review/terminal-mobile.png',fullPage:true});
  await page.getByRole('button',{name:'Preparar varredura'}).click();
  await expect(page.getByRole('heading',{name:'Scanner de sucata'})).toBeVisible();
  await page.screenshot({path:'.impeccable/review/scanner-mobile.png',fullPage:true});
  await page.setViewportSize({width:320,height:740});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
