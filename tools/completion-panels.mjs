// Exercise the same disclosure controls a player uses. Never bypass hidden UI.
export async function openCompletionPanels(page){
 await page.locator('#wrapup:not([hidden])').waitFor();
 for(const selector of ['.completion-more','.completion-extras']){
  const panel=page.locator('#wrapup '+selector);
  if(await panel.count()&&await panel.getAttribute('open')===null)await panel.locator(':scope > summary').click();
 }
}
