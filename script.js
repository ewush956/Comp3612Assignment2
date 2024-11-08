document.addEventListener("DOMContentLoaded", () =>{


    fetch("url of json data")
        .then(response => response.text())
        .then(text =>{

            /*going to have to stringify data as well*/
            const data = JSON.parse(text)


            /*Any code related to data goes here*/

        })
        .catch(error =>{

        });


});