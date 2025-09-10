// ===== CONTACT FORM FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function () {
  console.log('📞 Contact form functionality loaded');

  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    // ===== FORM VALIDATION & SUBMISSION =====
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      console.log('📝 Contact form submitted');

      // Get form data
      const formData = new FormData(contactForm);
      const firstName = formData.get('firstName');
      const lastName = formData.get('lastName');
      const email = formData.get('email');
      const company = formData.get('company');
      const industry = formData.get('industry');
      const projectType = formData.get('projectType');
      const message = formData.get('message');
      const newsletter = formData.get('newsletter');

      // Validation
      if (!firstName || !lastName || !email || !message) {
        showFormMessage('⚠️ Please fill in all required fields.', 'error');
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showFormMessage('⚠️ Please enter a valid email address.', 'error');
        return;
      }

      // Message length validation
      if (message.length < 10) {
        showFormMessage(
          '⚠️ Please provide more details about your project (minimum 10 characters).',
          'error'
        );
        return;
      }

      // Show loading state
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;

      submitButton.textContent = 'Sending Message...';
      submitButton.disabled = true;

      // Simulate API call
      setTimeout(() => {
        // Success simulation
        showFormMessage(
          `🎉 Thank you, ${firstName}! Your message has been sent successfully. Our team will get back to you within 24 hours.`,
          'success'
        );

        // Log form data (in real app, this would be sent to server)
        console.log('📊 Form Data:', {
          name: `${firstName} ${lastName}`,
          email,
          company,
          industry,
          projectType,
          message,
          newsletter: !!newsletter,
        });

        // Reset form
        contactForm.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;

        // Optional: redirect to thank you page after delay
        setTimeout(() => {
          // window.location.href = 'thank-you.html';
        }, 3000);
      }, 2000);
    });

    // ===== REAL-TIME FORM VALIDATION =====
    const formFields = contactForm.querySelectorAll('input, textarea, select');

    formFields.forEach((field) => {
      field.addEventListener('blur', function () {
        validateField(this);
      });

      field.addEventListener('input', function () {
        clearFieldError(this);
      });
    });

    // ===== FORM FIELD ENHANCEMENTS =====

    // Auto-resize textarea
    const messageField = document.getElementById('message');
    if (messageField) {
      messageField.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
      });
    }

    // Industry-specific project type suggestions
    const industryField = document.getElementById('industry');
    const projectTypeField = document.getElementById('projectType');

    if (industryField && projectTypeField) {
      industryField.addEventListener('change', function () {
        updateProjectTypeOptions(this.value, projectTypeField);
      });
    }

    // Character counter for message field
    if (messageField) {
      const charCounter = document.createElement('div');
      charCounter.className = 'char-counter';
      charCounter.style.cssText =
        'text-align: right; font-size: 0.8rem; color: #666; margin-top: 0.5rem;';
      messageField.parentNode.appendChild(charCounter);

      messageField.addEventListener('input', function () {
        const current = this.value.length;
        const max = 1000; // Set reasonable limit
        charCounter.textContent = `${current}/${max} characters`;

        if (current > max * 0.9) {
          charCounter.style.color = '#ff6b6b';
        } else {
          charCounter.style.color = '#666';
        }
      });

      // Initial count
      messageField.dispatchEvent(new Event('input'));
    }
  }

  // ===== UTILITY FUNCTIONS =====

  function showFormMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `form-message form-message-${type}`;
    messageElement.style.cssText = `
            padding: 1rem;
            border-radius: 5px;
            margin-bottom: 1rem;
            font-weight: 500;
            ${
              type === 'error'
                ? 'background: #ffe6e6; color: #d63031; border: 1px solid #fab1a0;'
                : 'background: #e6f7e6; color: #00b894; border: 1px solid #55efc4;'
            }
        `;
    messageElement.textContent = message;

    // Insert message at top of form
    contactForm.insertBefore(messageElement, contactForm.firstChild);

    // Auto-remove success messages
    if (type === 'success') {
      setTimeout(() => {
        messageElement.remove();
      }, 5000);
    }

    // Scroll to message
    messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;

    clearFieldError(field);

    // Required field validation
    if (field.hasAttribute('required') && !value) {
      showFieldError(field, `${getFieldLabel(field)} is required.`);
      return false;
    }

    // Email validation
    if (fieldName === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        showFieldError(field, 'Please enter a valid email address.');
        return false;
      }
    }

    // Message length validation
    if (fieldName === 'message' && value && value.length < 10) {
      showFieldError(
        field,
        'Please provide more details (minimum 10 characters).'
      );
      return false;
    }

    return true;
  }

  function showFieldError(field, message) {
    field.style.borderColor = '#d63031';

    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.style.cssText =
      'color: #d63031; font-size: 0.8rem; margin-top: 0.25rem;';
    errorElement.textContent = message;

    field.parentNode.appendChild(errorElement);
  }

  function clearFieldError(field) {
    field.style.borderColor = '#ddd';
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
      errorElement.remove();
    }
  }

  function getFieldLabel(field) {
    const label = field.parentNode.querySelector('label');
    return label ? label.textContent.replace('*', '').trim() : field.name;
  }

  function updateProjectTypeOptions(industry, projectTypeField) {
    const options = {
      'oil-gas': [
        { value: 'automation', text: 'Process Automation' },
        { value: 'scada', text: 'SCADA Systems' },
        { value: 'safety', text: 'Safety Systems' },
        { value: 'pipeline', text: 'Pipeline Monitoring' },
      ],
      manufacturing: [
        { value: 'automation', text: 'Manufacturing Automation' },
        { value: 'iot', text: 'IoT Implementation' },
        { value: 'maintenance', text: 'Predictive Maintenance' },
        { value: 'quality', text: 'Quality Control Systems' },
      ],
      chemicals: [
        { value: 'automation', text: 'Process Control' },
        { value: 'safety', text: 'Safety Systems' },
        { value: 'batch', text: 'Batch Processing' },
        { value: 'environmental', text: 'Environmental Monitoring' },
      ],
      power: [
        { value: 'automation', text: 'Power Plant Automation' },
        { value: 'grid', text: 'Smart Grid Solutions' },
        { value: 'renewable', text: 'Renewable Integration' },
        { value: 'monitoring', text: 'Asset Monitoring' },
      ],
    };

    // Clear current options except the first one
    while (projectTypeField.children.length > 1) {
      projectTypeField.removeChild(projectTypeField.lastChild);
    }

    // Add industry-specific options
    if (options[industry]) {
      options[industry].forEach((option) => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        projectTypeField.appendChild(optionElement);
      });
    } else {
      // Default options
      const defaultOptions = [
        { value: 'automation', text: 'Process Automation' },
        { value: 'iot', text: 'IoT Implementation' },
        { value: 'scada', text: 'SCADA Systems' },
        { value: 'maintenance', text: 'Predictive Maintenance' },
        { value: 'consulting', text: 'Consulting' },
        { value: 'other', text: 'Other' },
      ];

      defaultOptions.forEach((option) => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        projectTypeField.appendChild(optionElement);
      });
    }

    console.log(`🔄 Updated project options for industry: ${industry}`);
  }
});
