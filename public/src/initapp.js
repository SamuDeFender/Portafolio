// ----------------------------------------------------------------------
// Proceso y funciones para el seteo de la linea de tiempo
// ----------------------------------------------------------------------
var ydt = {}
var Json_data = new Object

const getParent = (element, cls) => {
    if (element && element.parentElement) {
        const parentClassName = element.parentElement.className;
        if (parentClassName === cls) {
            // console.log(element.parentElement)
            return element.parentElement; // Found it
        }
        return getParent(element.parentElement, cls)
    } else {
        return false; // No parent with such a className
    }
}


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
                    Json_data = data
                    createDataStructure(Json_data)
                    listenEventsInit()
                    // console.log(dqata)
                })
            .catch((error) => 
                   console.error("Unable to fetch data:", error));
}

// 2 > Creacción de estructura
function createDataStructure(jData, tJobs){

    const profdata = jData["Profesional"]
    const nonprofdata = jData['NonProfesional']
    const line = document.getElementById("line") // line es el padre de los circulos. Esta es la linea del tiempo.
    const fragment = new DocumentFragment
    const temp = document.getElementById("tST").content // se obtiene el contenido del template (todo)
    const tClone = temp.querySelector(".circle").cloneNode(true) // se clona para a futuro modificar el clon (no conectado al DOM) y dejar tranquilo el template original.

    // Checkea si el dictionary object pose llaves. Si es asi, es porque se llama esta función 
    // despues de que se haya iniciado la app. Se limpia el diccionary y se eliminan los elementos .circle
    if (Object.keys(ydt).length > 0) {ydt = {};const circle = document.querySelectorAll(".circle"); circle.forEach(el => {el.remove()})}

    // Se crea Array Alljobs que contiene todos los datos de trabajos
    // Alljobs capas (cuando se junta lo prof con lo no prof):
    //                                                              0                         1
    //      1. Array              <--- Alljobs          = [{..."Profesional"...}, {..."NonProfesional"},]
    //                                                     key = año                               
    //      2- Objetos/dictionary <--- Alljobs[i]       = {key: Array_x}  --->  AllJobs[i][key] = Array_x
    //                                                       0      1       n-1 trabajos en key año
    //      3. Array              <--- Alljobs[i][key]  = [{...}, {...}, ..., {...}]
    //      4. Objetos/dictionary
    //      5. Objetos/dictionary
    let alljobs = new Array
    
    if ((tJobs === undefined) || tJobs === "all") { //if para determinar si mostrar todo o no
        alljobs = [].concat(profdata, nonprofdata)   
        // console.log(alljobs) 
        for(var i in alljobs){ // i corresponde a tipo de dato -> 0 = datos profesionales, 1 = No profesional
            for(let key in alljobs[i]){ // key corresponde al año
                if ( !(key in ydt)) {ydt[key] = alljobs[i][key]} // Si el año no existe en el diccionario, agrega la info
                else {ydt[key] = [].concat(...ydt[key],...alljobs[i][key])} // De lo contrario, crea un array con la info ya dentro del dictionary y el de alljobs. Junta lo profesional y no profesional.
            }
        }
    } else {alljobs = jData[tJobs];for(var i in alljobs){ydt[i] = alljobs[i]}} 

    for(var key in ydt){
        let typeJob = ""
        if(ydt[key].length > 1) {
            let ul = document.createElement("ul")
            for(var j = 0;j<=ydt[key].length-1; j++){
                let li = document.createElement("li")
                li.setAttribute("type",ydt[key][j].typeJob) 
                
                if (j===0) { 
                    li.setAttribute("class","active");
                    typeJob = ydt[key][j].typeJob 
                } else {
                    li.setAttribute("class","");
                    if ( !(typeJob === ydt[key][j].typeJob) ) {
                        typeJob = "mix"
                    }
                }
                
                li.textContent = j+1   
                ul.appendChild(li)
            }
            tClone.querySelector(".card .cardview .cdata div").appendChild(ul)
        } else {
            typeJob = ydt[key][0].typeJob;
        }

        tClone.setAttribute("year",key)
        tClone.setAttribute("typeJob",typeJob)
        tClone.querySelector(".fx-pos").textContent = ydt[key][0]?.Details[1].Position ?? ydt[key].Details[1].Position
        tClone.querySelector(".comp").textContent = ydt[key][0]?.Company ?? ydt[key].Company
        tClone.querySelector(".res").textContent = ydt[key][0]?.Details[1].Abstract ?? ydt[key].Details[1].Abstract 
        tClone.querySelector(".cfooter a").textContent = "Saber más..."

        const cl = tClone.cloneNode(true)
        fragment.appendChild(cl)
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
            updateData(Number(this.textContent),getParent(this,"circle").getAttribute("year") )
            this.setAttribute("class","active")
        }
    }
    // 2.1
    getDistance()
    // 2.3
    listenEvents()
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

function listenEventsInit(){
    const tJobs = document.querySelector("#typeJobs")

    tJobs.addEventListener('click',e => {
        // console.log(e.target.tagName)
        if (e.target.tagName === "INPUT") {
            var txt = ""
            if (e.target.getAttribute("id") === "prof") {
                txt = "Profesional"
            } else if (e.target.getAttribute("id") === "noprof") {
                txt = "NonProfesional"
            } else {
                txt ="all"
            }

            createDataStructure(Json_data, txt)
        }
    })
}


function listenEvents(){
    const rMore = document.querySelectorAll(".circle .cfooter a")
    rMore.forEach(el => { 
        el.onclick = function () {
            const yr = getParent(this,"circle").getAttribute('year')
            const tJ = getParent(this,"cardview").querySelector('.cdata ul .active')?.getAttribute('type') ?? getParent(this,"circle").getAttribute('typeJob')
            const index = getParent(this,"cardview").querySelector('.cdata .comp').textContent ?? 0
            let txt = new String

            if (tJ === 'prof') {txt = 'Profesional'} else {txt = 'NonProfesional'}
            
            for(var i = 0; i< Json_data[txt][yr].length;i++ ){
                if(Json_data[txt][yr][i].Company === index) {
                    createDetailsStructure(Json_data[txt][yr][i])
                }
            }
            console.log(yr, tJ, index)
        }
    })
}

function createDetailsStructure(JobDetails) {
    const circle = document.querySelectorAll('.circle')
    circle.forEach(el => {el.setAttribute('hide',"")})

    const line = document.querySelector("#line")
    const fType = document.querySelector("#typeJobs")
    const hTxt = document.querySelector("#timeline").children[0] // cartel "Posicionate en cualquier año..."
    const cont = document.querySelector('#JobsDetails')

    console.log(document.querySelector("#timeline"))

    fType.style.display = 'none'
    hTxt.setAttribute('hidden','')
    line.style.height = "500px" // expande el cuadro para ver el detalle

    cont.removeAttribute('style')
    cont.querySelector(".Back-to-Main").onclick = function() {
        line.style.height = "0px"
        line.style.background = ""
        fType.style.display = ""
        hTxt.removeAttribute('hidden')
        cont.style.display = "none"
        createDataStructure(Json_data)
        const nd = meta.querySelector('ul')
        if( !(nd===null) ) {meta.removeChild(nd)}
    }

    const meta = cont.querySelector('.Meta')
    const cantJobs = Object.keys(JobDetails.Details).length

    if (cantJobs>1) {
        const ul = document.createElement('ul')
        for(const key in JobDetails.Details) {
            const li = document.createElement('li')
            if (key === '1') {li.classList.add('active')}
            li.textContent = key
            ul.appendChild(li)
        }

        ul.addEventListener('click', (el) => {
            if(el.target.tagName === 'LI') {
                for(var i=0;i<el.target.parentNode.children.length;i++){
                    el.target.parentNode.children[i].setAttribute('class','')
                }
                el.target.setAttribute('class','active')

                updateDataDetails(JobDetails, el.target.textContent)
            }
        })
        meta.appendChild(ul)
    }

    updateDataDetails(JobDetails)
}


function updateDataDetails(data, item = 1) {
    const cont = document.querySelector('#JobsDetails')
    const imgMain = cont.querySelector('.Image img')
    const imgCont = cont.querySelector('.Images')
    const tecCont = cont.querySelector('.Tecnologies-tags')
    const fx = cont.querySelector(".Funct-Company h3")
    const comp = cont.querySelector(".Funct-Company h4")
    const detData = cont.querySelector(".Details-data .abst")
    const funct = cont.querySelector(".Details-data .functions")
    const meta = cont.querySelector('.Meta')
    const jDate = meta.querySelector('.JobDate')
    const fDate = meta.querySelector('.FullDate')
    const fPath = data.FolderPath
    
    // Ayuda a setear FullDate de Meta
    var DStart = new Date(data.DateSta); var DEnd = new Date(data.DateEnd);
    if (DStart.getFullYear() === DEnd.getFullYear()) {DStart = DStart.toLocaleDateString('es-CL',{month:'short'}); DEnd = DEnd.toLocaleDateString('es-CL',{month:'short',year:'numeric'});}
    else {DStart = DStart.toLocaleDateString('es-CL',{month:'short',year:'numeric'}); DEnd = DEnd.toLocaleDateString('es-CL',{month:'short',year:'numeric'});}
    
    // Ayuda a setear JobDate de Meta
    var cantJobs = Object.keys(data.Details).length; 
    var DStart_j = new Date; var DEnd_j = new Date
    if(cantJobs>1){
        jDate.removeAttribute('hidden')
        DStart_j = new Date(data.Details[item].DateSta); DEnd_j = new Date(data.Details[item].DateEnd);
        if(DStart_j.getFullYear() === DEnd_j.getFullYear()){DStart_j = DStart_j.toLocaleDateString('es-CL',{month:'short'});DEnd_j = DEnd_j.toLocaleDateString('es-CL',{month:'short',year:'numeric'});}
        else {DStart_j = DStart_j.toLocaleDateString('es-CL',{month:'short',year:'numeric'}); DEnd_j = DEnd_j.toLocaleDateString('es-CL',{month:'short',year:'numeric'})}
    } else {
        jDate.setAttribute('hidden','')
    }

    fx.textContent = data.Details[item].Position
    comp.textContent = data.Company
    fDate.textContent = DStart.toUpperCase().replace('.','') + ' - ' + DEnd.toUpperCase()
    if (cantJobs > 1) jDate.textContent = DStart_j.toUpperCase().replace('.','') + ' - ' + DEnd_j.toUpperCase()
    detData.textContent = data.Details[item].Abstract
    funct.innerHTML = ''; for(var i=0;i<data.Details[item].Functions.length;i++){funct.innerHTML+=`<p>${data.Details[item].Functions[i]}</p>`}
    imgMain.src = fPath +'/main.png'
    
    imgCont.innerHTML='';
    console.log(data.Details[item].Resources.Images.length)
    if (data.Details[item].Resources.Images.length > 0){
        for(var i=0;i<data.Details[item].Resources.Images.length;i++) {
            if (data.Details[item].Resources.Images[i] === 'main.png'){ imgMainsrc = fPath + data.Details[item].Resources.Images[i] }
            const img = document.createElement('img')
            img.src = fPath + data.Details[item].Resources.Images[i]
            imgCont.appendChild(img)
        }
    } else {imgCont.innerHTML = '<h5>Sin recursos</h5>'; console.log('aqui')}
    
    tecCont.innerHTML = '<h5>Tecnologias</h5>';
    if (data.Details[item].Resources.Tecnology.length > 0){
        for(var i=0;i<data.Details[item].Resources.Tecnology.length;i++) {
            const img = document.createElement('img')
            img.src = `resources/images/svg-src/${data.Details[item].Resources.Tecnology[i]}`
            tecCont.appendChild(img)
        }
    } else {tecCont.innerHTML = '<h5>Sin recursos</h5>'; console.log('aqui')}

    imgCont.addEventListener('click', el => {
        if(el.target.tagName === 'IMG') {imgMain.setAttribute('src',el.target.getAttribute('src'))}
    })

    
}


readJobsJSON()