
document.getElementById('contact-form').addEventListener('submit', function(event){
    event.preventDefault();
    alert('Thank you for your message! This is a demo contact form.');
    this.reset();
});
