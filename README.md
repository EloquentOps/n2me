# n2me

n2me is a personal logging webapp for quick annotations that can be reviewed later using AI.
It's fully open source, 100% privacy focused personal tool.



### Purpose
Opportunity on using LLM to retrieve meaningful information from a mass of personal logs.

Personal logs are very privacy sensitive.

Thus, this tool can be run 100% locally on a device, data are stored locally. Nothing is sent anywhere.

Of course, using an LLM model requires to sent the data.

You can choose among different vendors and providers.

In the future, there'll be the possibility to run a local LLM model.

When it happen, the circle will be closed.


### How it works
You add quick notes, which are just text.
You pre assign a category to a better organization.
You can use voice or text input, depending on your preference.


### Settings
You need to set your language (for the speech synthesis) and the LLM settings for the AI review.


### Privacy
The webapp runs fully on your device, no data is sent to the cloud.
It uses PGLite to store data locally.



### Importing data
If you want to import pre-existing data into n2me, you can do using a specific CSV import function.
The CSV file need to have a column "content" with the text, the "date"and an optional column "category_id" (in this case the category need to exist in n2me).


### Contributing


### License

