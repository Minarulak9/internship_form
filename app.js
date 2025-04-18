document.getElementById('internshipForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get all form values
    const formData = {
        // Personal Information
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        dob: document.getElementById('dob').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        country: document.getElementById('country').value,
        
        // Education & Experience
        education: document.getElementById('education').value,
        institution: document.getElementById('institution').value,
        experience: document.querySelector('input[name="experience"]:checked')?.value,
        yearsExperience: document.getElementById('yearsExperience').value,
        portfolio: document.getElementById('portfolio').value,
        github: document.getElementById('github').value,
        
        // Skills & Preferences
        skills: Array.from(document.querySelectorAll('input[name="skills"]:checked')).map(cb => cb.value),
        otherSkills: document.getElementById('otherSkills').value,
        mongoRating: document.getElementById('mongoRating').value,
        reactRating: document.getElementById('reactRating').value,
        internshipType: document.getElementById('internshipType').value,
        availability: document.getElementById('availability').value,
        startDate: document.getElementById('startDate').value,
        relocation: document.getElementById('relocation').checked,
        
        // Projects & Portfolio
        projectDescription: document.getElementById('projectDescription').value,
        projectLink: document.getElementById('projectLink').value,
        codeSnippet: document.getElementById('codeSnippet').value,
        
        // Additional Information
        motivation: document.getElementById('motivation').value,
        source: document.getElementById('source').value,
        expectations: document.getElementById('expectations').value,
        newsletter: document.getElementById('newsletter').checked
    };
    
    // Handle file uploads (optional)
    const resumeFile = document.getElementById('resume').files[0];
    if (resumeFile) {
        formData.resumeFilename = resumeFile.name;
        // You would need additional code to actually upload the file to Google Drive
    }
    
    // Replace with your web app URL
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbxFM_qaU0KU8xzOuPhlPEBA43Nug1y8zs6mGGL2jx4Pil4IAY1Xs-uIKkKM2XGQIHtcsA/exec';
    
    // Submit to Google Sheets
    fetch(scriptUrl, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.result === 'success') {
            alert('Application submitted successfully!');
            // Optionally reset the form
            document.getElementById('internshipForm').reset();
        } else {
            throw new Error(data.error || 'Unknown error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was an error submitting your application. Please try again.');
    });
});