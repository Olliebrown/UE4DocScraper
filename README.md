# UE4 Documentation Scraper
node.js based tool for scraping the UE4 documentation for local/offline browsing.

## Description
This is a tool that will gather all the Unreal Engine 4 documentation located at docs.unrealengine.com and download it locally so you can browse it offline. It will also serve that documentation with a local server so that local JavaScript files can execute properly.

## Dependencies
This tool requires the following 3rd party program to be installed:
- nodejs: https://nodejs.org/
- bash: for windows, I recommend installing [git for windows](https://git-scm.com/download/win) to get bash
- HTTrack: https://www.httrack.com/page/2/en/index.html - Make sure the main httrack executable is in your path

## Quick Start
To create a local copy of the documentation, install the above dependencies, then run the following commands:
1. npm install
2. npm run scrape
3. Get a cup of coffee (this will take a while, like tens of hours)

To browse the files locally once they are downloaded, run the following commands:
1. npm run serve
2. open http://localhost:3000 in your browser

## Document Sets
I have divided the documentation into several separate pieces to make downloading and maintenance easier:
- **C++ API**: this grabs everything under en-us/API, documents the C++ scripting engine.
- **Blueprint API**: everything under en-us/BlueprintAPI, documents the Blueprint scripting engine.
- **Engine**: everything under en-us/Engine (but not en-us/Engine/Editor), documents the core engine architecture.
- **Editor**: everything under en-us/Engine/Editor, documents the main editor GUI.
- **Guides**: Everything else that isn't covered above (mostly custom guides and conceptual documentation).

If you look in the package.json file you can see the 'scripts' that are supported by 'npm run' for each of the individual parts.  If you do any individual parts, make sure you also run 'scrape:extras' and 'scrape:celanup' which will add some universal files and changes that are needed for everything to work.
