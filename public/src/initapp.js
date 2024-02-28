// ----------------------------------------------------------------------
// Proceso y funciones para el seteo de la linea de tiempo
// ----------------------------------------------------------------------
var ydt = {}


// 1 > Lectura de JSON con la información
function readJobsJSON() {
        fetch("resources/jobsData.json")
            .then((res) => {
                if (!res.ok) {
                    throw new Error
                        (`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                    createDataStructure(data)
                    // console.log(data)
                })
            .catch((error) => 
                   console.error("Unable to fetch data:", error));
}

// 2 > Creacción de estructura
function createDataStructure(jData){

    const profdata = jData["Profesional"]
    const nonprofdata = jData['NonProfesional']
    const line = document.getElementById("line")
    const fragment = new DocumentFragment
    const template = document.getElementById("tST").content
    const alljobs = [].concat(profdata, nonprofdata)

    
    for(var i in alljobs){
        for(let key in alljobs[i]){
            ydt[key] = alljobs[i][key]
        }
    }


    for(var key in ydt){
        
        if(ydt[key].length > 1) {
            const ul = document.createElement("ul")
            for(var j = 1;j<=ydt[key].length; j++){
                const li = document.createElement("li")
                if (j===1) { li.setAttribute("class","active") } else {li.setAttribute("class","")}
                li.textContent = j
                ul.appendChild(li)
            }
            template.querySelector(".card").appendChild(ul)
        }

        template.querySelector(".circle").setAttribute("year",key)
        template.querySelector(".fx-pos").textContent = ydt[key][0].Details[1].Position
        template.querySelector(".comp").textContent = ydt[key][0].Company
        template.querySelector(".res").textContent = ydt[key][0].Details[1].Abstract
        template.querySelector(".cfooter a").textContent = "Saber más..."

        const clone = template.cloneNode(true)
        fragment.appendChild(clone)
    }

    line.appendChild(fragment)

    // Agrega funcionalidad a los elementos li (no pude hacerlo antes... nose que fallaba)
    const lis = document.querySelectorAll(".card ul li")
    for(let i=0;i<lis.length;i++) {
        lis[i].onclick = function () {
            for(j=0;j<this.parentNode.children.length;j++) {
                this.parentNode.children[j].setAttribute("class","")
            }

            // 2.2
            updateData(Number(this.textContent), this.parentNode.parentNode.parentNode.getAttribute("year"))
            this.setAttribute("class","active")
        }
    }
    // 2.1
    getDistance()
}

// 2.1 > Configurar distancia de tiempo
function getDistance() {
    const lia = document.querySelectorAll("div.circle")
    const lT = window.getComputedStyle(document.getElementById("line")).getPropertyValue('flex-direction')
    const gl = document.getElementById("glowline")


    lia.forEach((el)=>{
        el.onmouseover = function() {
            if (lT === 'row') {
                gl.style.left = this.offsetLeft +'px' 
                if (Array.from(lia).indexOf(el) < (lia.length-1)){
                    gl.style.width = (lia[Array.from(lia).indexOf(el)+1].offsetLeft - this.offsetLeft) + 'px'
                } else {
                    // console.log(this.parentElement)
                    gl.style.width = (this.parentElement.offsetWidth - this.offsetLeft) + 'px'
                }
            } else {
                console.log(this.getBoundingClientRect().y)
            }
        }
        el.onmouseout = function() {
            gl.style.removeProperty('width')
        }
    })
}

// 2.2 > Actualiza la información
function updateData(item, year) {
    const circle = document.querySelector(".circle[year=" + CSS.escape(year) + "]")
    
    circle.querySelector(".fx-pos").textContent = ydt[year][item-1].Details[1].Position
    circle.querySelector(".comp").textContent = ydt[year][item-1].Company
    circle.querySelector(".res").textContent = ydt[year][item-1].Details[1].Abstract
}


// Llamada de funciones por iniciar
readJobsJSON()