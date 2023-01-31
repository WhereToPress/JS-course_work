const columns = document.querySelectorAll ('.column')
const lorems = document.querySelectorAll('.lorem')
const loremBtns = document.querySelectorAll('.lorem__active__button')

document.addEventListener('keydown', event => {
    event.preventDefault()
    if (event.code.toLowerCase() === 'space') {
        setRandomColors()
    }
})

document.addEventListener('click', event => {
    const type = event.target.dataset.type

    if (type === 'lock') {
        const node = event.target.tagName.toLowerCase() === 'i' ? event.target : event.target.children[0]

        node.classList.toggle('fa-lock-open')
        node.classList.toggle('fa-lock')
    } else if (type === 'copy') {
        copyToClickboard(event.target.textContent)
    } 
})

function generateRandomColor () {
    const hexCodes = '0123456789ABCDEF'
    let color = ''
    for (let i = 0; i < 6; i++){
        color += hexCodes[Math.floor(Math.random() * hexCodes.length)]
    }
    return '#' + color
}

function LoremVisible(index) {
    const lorem = lorems[index]
    if (lorem) {
        lorem.classList.toggle('lorem__visible')
    }
}

loremBtns.forEach((loremBtn, index) => {
    loremBtn.addEventListener('click', (event) => {
        event.preventDefault()
        const type = event.target.dataset.type
        if (type === 'lorem') {
            const active = event.target.tagName.toLowerCase() === 'i' ? event.target : event.target.children[0]
    
            active.classList.toggle('fa-font')
            active.classList.toggle('fa-comments')
            LoremVisible(index)    
        }
    })
})

function copyToClickboard(text) {
    return navigator.clipboard.writeText(text)
}

function setRandomColors (isInitial) {
    const colors = isInitial ? getColorsFromHash() : []
    columns.forEach((columns, index) => {
        const isLocked = columns.querySelector('i').classList.contains('fa-lock')
        const text = columns.querySelector('h2')
        const button = columns.querySelector('button')
        const lorem = columns.querySelector('p')
        const loremButton = columns.querySelector('.lorem__active__button')

        if (isLocked) {
            colors.push(text.textContent)
            return
        }

        const color = isInitial
        ? colors[index]
            ? colors[index]
            : chroma.random()
        : chroma.random()

        if (!isInitial) {
            colors.push(color)
        }

        text.textContent = color
        columns.style.background = color

        setTextColor(text, color)
        setTextColor(button, color)
        setTextColor(lorem, color)
        setTextColor(loremButton, color)
    })
    updateColorsHash(colors)
}

function setTextColor(text, color){
    const luminance = chroma(color).luminance()
    text.style.color = luminance > 0.5 ? 'black' : 'white'
}

function updateColorsHash(colors = []) {
    document.location.hash = colors.map((col) => {
        return col.toString().substring(1)
    }).join('-')
}

function getColorsFromHash() {
    if (document.location.hash.length > 1) {
        return document.location.hash.substring(1).split('-').map(color => '#' + color)
    }
    return []
}

setRandomColors(true)