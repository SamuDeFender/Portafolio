// ----------------------------------------------------------------------
// Proceso y funciones para el seteo de la linea de tiempo
// ----------------------------------------------------------------------

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
            .then((data) => 
                  console.log(data))
            .catch((error) => 
                   console.error("Unable to fetch data:", error));
}

function ExtractJobsData(cd, li){
    let cv = cd.getElementsByClassName("cardview")[0].getElementsByClassName("cdata")[0]
    let fu_pos = cv.getElementsByClassName("fx-pos")
    let comp = cv.getElementsByClassName("comp")
    let res = cv.getElementsByClassName("res")  

    fu_pos[0].innerText = "Practica profesional - Eficiencia Operacional"
    comp[0].innerText = "CencoSud Shopping S.A"
    res[0].innerText = "Hola hola hola"

    console.log(li)
}



// 2 > Correción de años en TimeLine (circle element)
function setYearTimeline (per) {
    let cCircle = document.querySelectorAll(".circle")
    var i = 4
    cCircle.forEach((el) => el.setAttribute("year", new Date().getFullYear() - i--))  
}

// 3 > Creaccion de ul y li elements para cada año
function createDataStructure(){
    let ul = document.createElement("ul");
    let nj_c = [1,2,3]

    console.log(ul)

    for(var i=0;i<nj_c.length;i++){
        let li = document.createElement("li");
        let liText = document.createTextNode(nj_c[i]);

        if (i === 0) {
            li.className = "nj active"
            
        } else {
            li.className ="nj"
        }

        li.onclick = function() {
            for (var i = 0; i<ul.children.length;i++){
                ul.children[i].className="nj"
            }

            li.setAttribute("class","nj active") 
            ExtractJobsData(ul.parentElement, li.textContent)
        }

        li.appendChild(liText);
        ul.appendChild(li);
    }

    let cYear = document.getElementsByClassName("circle");
    let cData = cYear.item(0)
    let card = cData.children
    // console.log(card[0]);
    card[0].appendChild(ul)
}

    
function getDistance() {
    const lia = document.querySelectorAll(".circle")
    const lT = window.getComputedStyle(document.getElementById("line")).getPropertyValue('flex-direction')
    const gl = document.getElementById("glowline")

    lia.forEach((el)=>{
        console.log(el)
        el.onmouseover = function() {
            if (lT === 'row') {
                gl.style.left = this.offsetLeft +'px' 
                if (Array.from(el.parentNode.children).indexOf(el) < (el.parentNode.childElementCount-1)){
                    gl.style.width = ( lia[Array.from(el.parentNode.children).indexOf(el)].offsetLeft - this.offsetLeft) + 'px'
                } else {
                    gl.style.width = (this.parentElement.offsetWidth - this.offsetLeft) + 'px'
                }
            } else {
                console.log(this.getBoundingClientRect().y)
            }
        }
    })
}


// Llamada de funciones por iniciar
setYearTimeline()
createDataStructure()
getDistance()
readJobsJSON()