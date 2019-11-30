**LIBGEN REST API**
---

---
This is a simple REST API with just GET requests to search eBooks and get direct download link for any of the eBook in the search results.

This project make use of [Library Genesis](https://en.wikipedia.org/wiki/Library_Genesis) project. It is a web scraper which scrapes only useful information from Libgen and provides to client.

Requirements to deploy
---
1. Node
2. npm 

How to deploy?
---
1. Clone this repository.
  
    `git clone https://github.com/sparkskapil/libgen-rest-api.git`
2. Navigate to the cloned repository.

    `cd libgen-rest-api`

3. Install dependency packages.

    `npm install`

4. Start the server.

    `npm start` 

Usage
---
When using on localhost it will deploy itself on port 8080. Let us assume the server is deployed at http://localhost:8080/

1. Getting search results for a book.
  
    `GET http://localhost:8080/?req=sherlock%20holmes`
    
    ```
    `RESPONSE`
    [
        {
          "ID": "273515",
          "Author(s)": "Victor Katz, Robin Wilson, Marlow Anderson",
          "Title": "SpectrumSherlock Holmes in Babylon and Other Tales of Mathematical History (Spectrum) 9780883855461, 0883855461",
          "Publisher": "The Mathematical Association of America",
          "Year": "2004",
          "Pages": "400",
          "Language": "English",
          "Size": "19 Mb",
          "Extension": "djvu",
          "Mirrors": "http://93.174.95.29/_ads/59E8EC2D632CEC7CEDF38141EE21CA6F",
          "server": "http://93.174.95.29",
          "cover": "http://93.174.95.29/covers/393000/4c22ba9de2fcf6404fc1975d1137c8c5-d.jpg ",
          "md5": "4C22BA9DE2FCF6404FC1975D1137C8C5"
        },
    ...
    ]
    ``` 

    * This API request returns the results for ebooks containing `sherlock holmes` in the title.
    * This will by default return the results on `Page 1`.


  2. Getting second page of search results for a book. 

      `GET http://localhost:8080/?req=sherlock%20holmes&page=2`

      * This API request returns the `Page 2` of search results for ebooks containing `sherlock holmes` in the title.
  
  3. Getting results on multiple pages with single request.

      `GET http://localhost:8080/?req=sherlock%20holmes&page=3&multi=true`

      * This API request returns all the results from `Page 1` to `Page 3` of search results for ebooks containing `sherlock holmes` in the title.

  4. Getting direct download link for an eBook in the search result.

      `GET http://localhost:8080/download?Mirrors=http://93.174.95.29/_ads/59E8EC2D632CEC7CEDF38141EE21CA6F&Extension=djvu&server=http://93.174.95.29`

      * This link will download the above mentioned eBook in the response example.

Credits
---
This is one of my hobby project to learn Node and Express. I am open to suggestions for this project. I will be accepting Pull requests if you would like to contribute to this project.

  

