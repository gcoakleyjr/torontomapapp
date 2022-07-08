const items = posts.features

const list_element = document.getElementById("all-posts")
const pagination_element = document.getElementById("pagination")

let current_page = 1
let rows = 5

function DisplayList(items, wrapper, rowsPerPage, page) {
    wrapper.innerHTML = ""
    page--
   
    let start = rowsPerPage * page
    let end = start + rowsPerPage
    let paginatedItems = items.slice(start, end)

    for (let i = 0; i < paginatedItems.length; i++) {
        let item = paginatedItems[i]
        let postImage = `<div class="col-md-4"><img class="img-fluid" alt="" src="${item.images[0].url}"></div>`

        wrapper.innerHTML += `
        <div class="card mb-3" >
        <div class="row">

            ${item.images.length ? postImage : ""}

                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title mb-0">
                            ${item.title}
                        </h5>
                        <p class="card-text text-muted fs-6">Posted by <a class="link-secondary" href="#">
                                ${item.author.username}
                            </a></p>
                        <p class="card-text">
                            <${item.description}
                        </p>
                        <p class="card-text">
                            <small class="text-muted">
                                ${item.location}
                            </small>
                        </p>
                        <a class="btn btn-primary" href="/posts/${item._id}">View
                            ${item.title}
                        </a>
                    </div>
                </div>
        </div>
    </div>
        `
    }
}

function SetupPagination (items, wrapper, rowsPerPage) {
    wrapper.innerHTML = ""

    let pageCount = Math.ceil(items.length / rowsPerPage)
    for (let i = 1; i < pageCount + 1; i++) {
        let btn = PaginationButton(i, items);
        wrapper.appendChild(btn)
    }
}

function PaginationButton (page, items) {
    let button = document.createElement("li")
    button.classList.add("page-item")
    let link = `<a class="page-link" href="#all-posts">${page}</a>`
    button.innerHTML = link

    if (current_page == page) button.classList.add("active")

    button.addEventListener("click", function() {
        current_page = page
        DisplayList(items, list_element, rows, current_page)

        let currentBtn = document.querySelector(".pagination li.active")
        console.log(currentBtn)
        currentBtn.classList.remove("active")
        button.classList.add("active")
    })

    return button
}

DisplayList(items, list_element, rows, current_page)
SetupPagination(items, pagination_element, rows)