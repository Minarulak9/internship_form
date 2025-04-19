document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('internshipForm');
    const modal = document.getElementById('success-modal');
    const submittedContainer = document.getElementById('submitted-container');
    const modalOkBtn = document.getElementById('modal-ok-btn');
    const formContainer = document.querySelector('.form-container');
    const newSubmissionBtn = document.getElementById('new-submission-btn');
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbwx0pKLslOlZpH-CaISzJ3Sw7j7Yrkrnn-iOZOjWRXR71uPZMRfJkwijs8yCAECmBuLAA/exec';
    


    if (localStorage.getItem('formSubmitted') === 'true') {
      formContainer.style.display = 'none';
      submittedContainer.style.display = 'block';
    }

    modalOkBtn.addEventListener('click', function() {
      modal.style.display = 'none';
      formContainer.style.display = 'none';
      submittedContainer.style.display = 'block';
    });
    
    newSubmissionBtn.addEventListener('click', function() {
      localStorage.removeItem('formSubmitted');
      submittedContainer.style.display = 'none';
      formContainer.style.display = 'block';
    });

    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Show loading state
      const submitBtn = document.querySelector('.submit-btn');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>Submitting...</span>';
      submitBtn.disabled = true;
      
      try {
        // Get form data
        const formData = {
          fullName: document.getElementById('fullName').value,
          email: document.getElementById('email').value,
          phone: document.getElementById('phone').value,
          dob: document.getElementById('dob').value,
          address: document.getElementById('address').value,
          city: document.getElementById('city').value,
          country: document.getElementById('country').value,
          education: document.getElementById('education').value,
          institution: document.getElementById('institution').value,
          experience: document.querySelector('input[name="experience"]:checked')?.value,
          yearsExperience: document.getElementById('yearsExperience').value,
          portfolio: document.getElementById('portfolio').value,
          github: document.getElementById('github').value,
          skills: Array.from(document.querySelectorAll('input[name="skills"]:checked')).map(cb => cb.value),
          otherSkills: document.getElementById('otherSkills').value,
          internshipType: document.getElementById('internshipType').value,
          availability: document.getElementById('availability').value,
          startDate: document.getElementById('startDate').value,
          projectDescription: document.getElementById('projectDescription').value,
          projectLink: document.getElementById('projectLink').value,
          codeSnippet: document.getElementById('codeSnippet').value,
          motivation: document.getElementById('motivation').value,
          source: document.getElementById('source').value,
          expectations: document.getElementById('expectations').value,
          newsletter: document.getElementById('newsletter').checked
        };
        
        // Handle resume file
        const resumeFile = document.getElementById('resume').files[0];
        if (resumeFile) {
          await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function(event) {
              formData.resumeData = event.target.result; // Base64 encoded file
              formData.resumeName = resumeFile.name;
              formData.resumeType = resumeFile.type;
              resolve();
            };
            reader.onerror = reject;
            reader.readAsDataURL(resumeFile);
          });
        }
        
        // Try the more reliable method using a hidden form
        const result = await submitFormUsingIframe(formData);
        
        // Show success message
        // alert('Thank you! Your application was submitted successfully.');
        // form.reset();
        
        setTimeout(() => {
          modal.style.display = 'flex';
          localStorage.setItem('formSubmitted', 'true');
          form.reset();
        }, 500);
      } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong: ' + error.message);
      } finally {
        // Restore button state
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      }
    });
  
    /**
     * Submit form using iframe to avoid CORS
     */
    function submitFormUsingIframe(formData) {
      return new Promise((resolve, reject) => {
        // Create a unique ID for this submission
        const uniqueId = 'form_' + Date.now();
        
        // Create an iframe (hidden)
        const iframe = document.createElement('iframe');
        iframe.name = uniqueId;
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        
        // Create a form
        const hiddenForm = document.createElement('form');
        hiddenForm.action = scriptUrl;
        hiddenForm.target = uniqueId;
        hiddenForm.method = 'POST';
        hiddenForm.style.display = 'none';
        
        // Add data as hidden fields
        const dataField = document.createElement('input');
        dataField.type = 'hidden';
        dataField.name = 'data';
        dataField.value = JSON.stringify(formData);
        hiddenForm.appendChild(dataField);
        
        // Append form to document and submit
        document.body.appendChild(hiddenForm);
        
        // Set up message listener for response
        const messageListener = function(event) {
          try {
            // Only process messages that might be from our script
            if (event.data && typeof event.data === 'string') {
              const data = JSON.parse(event.data);
              if (data.formSubmissionId === uniqueId) {
                // Clean up
                window.removeEventListener('message', messageListener);
                document.body.removeChild(iframe);
                document.body.removeChild(hiddenForm);
                
                if (data.result === 'success') {
                  resolve(data);
                } else {
                  reject(new Error(data.message || 'Form submission failed'));
                }
              }
            }
          } catch (e) {
            // Not our message or not valid JSON, ignore
          }
        };
        
        window.addEventListener('message', messageListener);
        
        // Set timeout
        const timeoutId = setTimeout(() => {
          window.removeEventListener('message', messageListener);
          if (document.body.contains(iframe)) document.body.removeChild(iframe);
          if (document.body.contains(hiddenForm)) document.body.removeChild(hiddenForm);
          reject(new Error('Form submission timed out after 1 minute'));
        }, 60000);
        
        // Submit the form
        hiddenForm.submit();
        
        iframe.onload = function() {
          // On successful load with no message, assume success after 1 second
          // (this is a fallback if postMessage doesn't work)
          setTimeout(() => {
            if (document.body.contains(iframe)) {
              window.removeEventListener('message', messageListener);
              clearTimeout(timeoutId);
              document.body.removeChild(iframe);
              document.body.removeChild(hiddenForm);
              resolve({ result: 'success', message: 'Form submitted (iframe loaded)' });
            }
          }, 1000);
        };
      });
    }
  });