const form = document.querySelector('.needs-validation')
const keywordInput = document.querySelector('.input-keyword')
const errMsg = document.querySelector('.error small')
const deleteBtn = document.querySelector('.btn-delete')

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