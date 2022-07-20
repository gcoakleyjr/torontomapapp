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
        let postImage = `<a href="/posts/${item._id}" class="col-md-4 post-image-container"><img class="img-fluid post-image" alt="" src="${item.images[0] ? item.images[0].url.replace("/upload", "/upload/c_fill,h_500,w_500") : "https://res.cloudinary.com/dx1cp4cj9/image/upload/v1657490148/MapApp/defaultImg_tyaehu.jpg"}"></a>`
        let dateText = item.daysFromCreation === 0 ? "Posted today" : item.daysFromCreation === 1 ? "Posted 1 day ago" : `Posted ${item.daysFromCreation} days ago`
        let likes = item.likedBy.length === 1 ? "1 like" : `${item.likedBy.length} likes`

        wrapper.innerHTML += `
        <div class="card mb-3 font-white" >
        <div class="row">

            ${postImage}

                <div class="col-md-8">
                    <div class="card-body">
                        <a class="index-post-title" href="/posts/${item._id}">
                            <h5 class="card-title mb-0">
                                ${item.title}
                            </h5>
                        </a>
                        <p class="card-text text-muted-c fs-6">Posted by <a class="link-secondary" href="#">
                                ${item.author.username}
                            </a></p>
                        <p class="card-text clip-text">
                            ${item.description}
                        </p>
                        <p class="card-text">
                            <small class="text-muted-c">
                                ${item.location}
                            </small>
                        </p>
                        <p class="text-muted-c post-info mb-0">
                             <small class="post-date">${dateText}</small>
                             <small><img class="upvote-btn-index" src="/images/upvote-index.svg">${likes}</small>       
                        </p>
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
        currentBtn.classList.remove("active")
        button.classList.add("active")
    })

    return button
}

DisplayList(items, list_element, rows, current_page)
SetupPagination(items, pagination_element, rows)