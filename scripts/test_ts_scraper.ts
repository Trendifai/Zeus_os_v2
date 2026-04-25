import { scrapeUrl } from '../src/app/actions/scrape_tool';

(async () => {
  const result = await scrapeUrl('https://manipura.shop');
  console.log('SUCCESS:', result.success);
  console.log('TITLE:', result.title);
  console.log('PREVIEW:', result.content?.slice(0, 200));
})();