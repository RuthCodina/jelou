# Jelou Blog

This blog was developed using the npm modules; 
- express as a framework, 
- ejs as Embedded JavaScript templates
- mongodb as the unstructured database
- nodemon which executes the `start` command automatically.
- bcrypt for storing encrypted information in the DB
- cookie-parser to generate user sessions
- jsonwebtoken to generate user session token
- etc.

The application is running on port **5000**

Para consultar todas las rutas de autenticación, será necesario colocar en el buscador del navegador la ruta **localhost:5000/admin**

In this path you will be able to;
* create a post
* delete a post
* update a post
* view the created posts.

in the path **/ **

it will be possible to visualize the created posts and to search by key words the posts.

To be able to see the management of the app, it will be necessary to create an account in **mongodb atlas** start a cluster and in an .env file, put the credentials of this and the link to connect from **VSCODE**, because this file has not been uploaded to github.

To run the program you will need to run the `npm run dev` command.  Don't forget to place yourself in the folder **blog**.


