const form = document.querySelector('.needs-validation')
const keywordInput = document.querySelector('.input-keyword')
const errMsg = document.querySelector('.error small')
const dataPanel = document.querySelector('#data-panel')

form.addEventListener('submit', (event) => {
  const target = event.target
  if (!target.checkValidity()) {
    event.preventDefault();
    event.stopPropagation();
  }
  target.classList.add('was-validated')
}, false)

keywordInput.addEventListener('focus', (event) => {
  const target = event.target
  if (target) {
    form.classList.remove('was-validated')
    errMsg.innerText = ''
  }
})

dataPanel.addEventListener('click', event => {
  const target = event.target
  if (target.matches('.btn-delete') || target.matches('#span-delete')) {
    const modalTitle = document.querySelector('.modal-title')
    const modalBody = document.querySelector('.modal-body')
    const confirmForm = document.querySelector('#confirm-form')

    modalTitle.innerText = '刪除餐廳'
    modalBody.innerText = `確定要刪除「${target.dataset.name}」?`
    confirmForm.action = `/restaurants/${target.dataset.id}?_method=DELETE`
  }
})