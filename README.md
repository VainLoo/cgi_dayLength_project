# CGI Day Length Project

Project for CGI summer internship candidacy.
This is a Nuxt.js based project using JavaScript. Further explanation about the project can be found in the Wiki in Estonian.

I have prepared 2 explanations for getting the project up and running. First one requires Node.js and the second one Docker. But the project can also be found already running on Heroku:  
https://cgi-day-lenght-calculator.herokuapp.com

Naturally, you should first navigate to the projects root directory.  

## Running with Node.js
Standard way for running Nuxt projects.


```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## Running with Docker
NB: Make sure you have docker running.
```
$ docker build -t cgi_day_length_project .

$ docker run -it -p 3000:3000 cgi_day_length_project
```

Now running on http://localhost:3000/
