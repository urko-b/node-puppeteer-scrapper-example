const functions = require('firebase-functions');

const cors = require('cors')({ origin: true });

const cheerio = require('cheerio');
const getUrls = require('get-urls');
const fetch = require('node-fetch');
const puppeteer = require('puppeteer');


const scrapeMetaTags = (text) => {
    const urls = Array.from(getUrls(text));

    const requests = urls.map(async url => {
        const res = await fetch(url);
        const html = await res.text();

        const $ = cheerio.load(html);

        const getMetatag = (name) =>
            $(`meta[name=${name}]`).attr('content') ||
            $(`meta[property:"og:${name}"]`).attr('content') ||
            $(`meta[property:"twitter:${name}"]`).attr('content');

        return {
            url,
            title: $('title').first().text(),
            favicon: $('link[rel="shortcut icon"]').attr('href'),
            description: getMetatag('description'),
            image: getMetatag('image'),
            //author: getMetatag('author')
        }
    });

    return Promise.all(requests);
};


exports.scrapeMetaTags = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {

        const body = request.body;
        const data = await scrapeMetaTags(body.text);

        response.send(data);
    });
});



const scrapeCourses = async () => {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();
    await page.goto('https://www.edx.org/es');


    await page.type('[id=home-search]', 'big data');
    await page.click('[type=submit]');

    await page.waitFor(2000);

    await autoScroll(page);


    const courses = await page.$$eval('.discovery-card-inner-wrapper', nodes => {
        return nodes.map(node => {
            const a = node
                .querySelector('a');

            const courseUrl = a.href;

            const title = cleanWhiteSpaces(a.querySelector('div > h3').textContent);
            const teacher = cleanWhiteSpaces(a.querySelector('div .label').textContent);
            const courseStartsInfo = cleanWhiteSpaces(a.querySelector('div .course-start-info').textContent);

            return {
                courseUrl,
                title,
                teacher,
                courseStartsInfo
            }
        });
    });

    await browser.close();
    return courses;
};


const cleanWhiteSpaces = (text) => text.replace(/\s\s+/g, '');

const autoScroll = async (page) => {
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
};

exports.scrapeCourses = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {
        try {
            response.send(await scrapeCourses());

        } catch (error) {
            response.status(500).send(error);
        }
    });
});