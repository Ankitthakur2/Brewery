
 
const signupBtn = document.getElementById('signupBtn');
  signupBtn.addEventListener('click', () => {
    
    console.log("clicked signup");
    
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;


   console.log(username,password);
  


    
    if (!username || !password) {
      console.log('Please enter both username and password');
    } 

      
  });
