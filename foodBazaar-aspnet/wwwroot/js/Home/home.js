
function openLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    clearValidationErrors('loginForm');
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';

    document.getElementById('loginForm').reset();
    clearValidationErrors('loginForm');
}

function openRegisterModal() {
    const modal = document.getElementById('registerModal');
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    clearValidationErrors('registerForm');
}

function closeRegisterModal() {
    const modal = document.getElementById('registerModal');
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';

    document.getElementById('registerForm').reset();
    clearValidationErrors('registerForm');
}

function openForgotPasswordModal() {
    closeLoginModal();
    const modal = document.getElementById('forgotPasswordModal');
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeForgotPasswordModal() {
    const modal = document.getElementById('forgotPasswordModal');
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';

    document.getElementById('forgotPasswordForm').classList.remove('hidden');
    document.getElementById('forgotPasswordSuccess').classList.add('hidden');
    document.getElementById('forgotEmail').value = '';
    document.getElementById('forgotEmailError').textContent = '';
}

function switchToRegister() {
    closeLoginModal();
    setTimeout(() => openRegisterModal(), 300);
}

function switchToLogin() {
    closeRegisterModal();
    setTimeout(() => openLoginModal(), 300);
}

function backToLogin() {
    closeForgotPasswordModal();
    setTimeout(() => openLoginModal(), 300);
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

function validatePasswordStrength(password) {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    return re.test(password);
}

function showError(inputId, message) {
    const input = document.getElementById(inputId);
    const errorSpan = input.nextElementSibling;

    input.classList.add('input-error');
    if (errorSpan && errorSpan.classList.contains('error-message')) {
        errorSpan.textContent = message;
    }
}

function clearError(inputId) {
    const input = document.getElementById(inputId);
    const errorSpan = input.nextElementSibling;

    input.classList.remove('input-error');
    if (errorSpan && errorSpan.classList.contains('error-message')) {
        errorSpan.textContent = '';
    }
}

function clearValidationErrors(formId) {
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll('input');

    inputs.forEach(input => {
        input.classList.remove('input-error');
    });

    const errorSpans = form.querySelectorAll('.error-message');
    errorSpans.forEach(span => {
        span.textContent = '';
    });

    const summaryId = formId === 'loginForm' ? 'loginValidationSummary' : 'registerValidationSummary';
    const summary = document.getElementById(summaryId);
    if (summary) {
        summary.classList.add('hidden');
    }
}

function showValidationSummary(formId, errors) {
    const summaryId = formId === 'loginForm' ? 'loginValidationSummary' : 'registerValidationSummary';
    const listId = formId === 'loginForm' ? 'loginValidationList' : 'registerValidationList';

    const summary = document.getElementById(summaryId);
    const list = document.getElementById(listId);

    list.innerHTML = '';
    errors.forEach(error => {
        const li = document.createElement('li');
        li.textContent = error;
        list.appendChild(li);
    });

    summary.classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            clearValidationErrors('loginForm');

            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;

            let isValid = true;
            const errors = [];

            if (!email) {
                showError('loginEmail', 'E-posta adresi gereklidir');
                errors.push('E-posta adresi gereklidir');
                isValid = false;
            } else if (!validateEmail(email)) {
                showError('loginEmail', 'Geçerli bir e-posta adresi giriniz');
                errors.push('Geçerli bir e-posta adresi giriniz');
                isValid = false;
            }

            if (!password) {
                showError('loginPassword', 'Şifre gereklidir');
                errors.push('Şifre gereklidir');
                isValid = false;
            } else if (!validatePassword(password)) {
                showError('loginPassword', 'Şifre en az 6 karakter olmalıdır');
                errors.push('Şifre en az 6 karakter olmalıdır');
                isValid = false;
            }

            if (!isValid) {
                showValidationSummary('loginForm', errors);
                return;
            }

            try {
                const formData = new FormData(loginForm);
                const response = await fetch('/Account/Login', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });

                if (response.ok) {
                    const result = await response.json();

                    if (result.success) {
                        window.location.href = result.redirectUrl || '/';
                    } else {
                        if (result.errors && result.errors.length > 0) {
                            showValidationSummary('loginForm', result.errors);
                        } else {
                            showValidationSummary('loginForm', ['Giriş başarısız. Lütfen bilgilerinizi kontrol edin.']);
                        }
                    }
                } else {
                    loginForm.submit();
                }
            } catch (error) {
                console.error('Login error:', error);
                loginForm.submit();
            }
        });
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            clearValidationErrors('registerForm');

            const fullName = document.getElementById('registerFullName').value.trim();
            const email = document.getElementById('registerEmail').value.trim();
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirmPassword').value;
            const acceptTerms = document.getElementById('registerAcceptTerms').checked;

            let isValid = true;
            const errors = [];

            if (!fullName) {
                showError('registerFullName', 'Ad Soyad gereklidir');
                errors.push('Ad Soyad gereklidir');
                isValid = false;
            } else if (fullName.length < 3) {
                showError('registerFullName', 'Ad Soyad en az 3 karakter olmalıdır');
                errors.push('Ad Soyad en az 3 karakter olmalıdır');
                isValid = false;
            }

            if (!email) {
                showError('registerEmail', 'E-posta adresi gereklidir');
                errors.push('E-posta adresi gereklidir');
                isValid = false;
            } else if (!validateEmail(email)) {
                showError('registerEmail', 'Geçerli bir e-posta adresi giriniz');
                errors.push('Geçerli bir e-posta adresi giriniz');
                isValid = false;
            }

            if (!password) {
                showError('registerPassword', 'Şifre gereklidir');
                errors.push('Şifre gereklidir');
                isValid = false;
            } else if (!validatePassword(password)) {
                showError('registerPassword', 'Şifre en az 6 karakter olmalıdır');
                errors.push('Şifre en az 6 karakter olmalıdır');
                isValid = false;
            } else if (!validatePasswordStrength(password)) {
                showError('registerPassword', 'Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir');
                errors.push('Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir');
                isValid = false;
            }

            if (!confirmPassword) {
                showError('registerConfirmPassword', 'Şifre tekrarı gereklidir');
                errors.push('Şifre tekrarı gereklidir');
                isValid = false;
            } else if (password !== confirmPassword) {
                showError('registerConfirmPassword', 'Şifreler eşleşmiyor');
                errors.push('Şifreler eşleşmiyor');
                isValid = false;
            }


            if (!acceptTerms) {
                errors.push('Kullanım koşullarını kabul etmelisiniz');
                isValid = false;
            }

            if (!isValid) {
                showValidationSummary('registerForm', errors);
                return;
            }

            try {
                const formData = new FormData(registerForm);
                const response = await fetch('/Account/Register', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });

                if (response.ok) {
                    const result = await response.json();

                    if (result.success) {
                        window.location.href = result.redirectUrl || '/';
                    } else {
                        if (result.errors && result.errors.length > 0) {
                            showValidationSummary('registerForm', result.errors);
                        } else {
                            showValidationSummary('registerForm', ['Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.']);
                        }
                    }
                } else {
                    registerForm.submit();
                }
            } catch (error) {
                console.error('Register error:', error);
                registerForm.submit();
            }
        });
    }

    const inputs = document.querySelectorAll('input[data-val="true"]');
    inputs.forEach(input => {
        input.addEventListener('blur', function () {
            const value = this.value.trim();
            const inputId = this.id;

            clearError(inputId);

            if (this.hasAttribute('data-val-required') && !value) {
                showError(inputId, this.getAttribute('data-val-required'));
            } else if (this.hasAttribute('data-val-email') && value && !validateEmail(value)) {
                showError(inputId, this.getAttribute('data-val-email'));
            } else if (this.hasAttribute('data-val-minlength')) {
                const minLength = parseInt(this.getAttribute('minlength'));
                if (value && value.length < minLength) {
                    showError(inputId, this.getAttribute('data-val-minlength'));
                }
            } else if (this.hasAttribute('data-val-regex-pattern') && value) {
                const pattern = new RegExp(this.getAttribute('data-val-regex-pattern'));
                if (!pattern.test(value)) {
                    showError(inputId, this.getAttribute('data-val-regex'));
                }
            } else if (this.hasAttribute('data-val-equalto-other') && value) {
                const otherInputName = this.getAttribute('data-val-equalto-other');
                const otherInput = document.querySelector(`input[name="${otherInputName}"]`);
                if (otherInput && value !== otherInput.value) {
                    showError(inputId, this.getAttribute('data-val-equalto'));
                }
            }
        });

        input.addEventListener('input', function () {
            clearError(this.id);
        });
    });
});

function handleForgotPassword() {
    const email = document.getElementById('forgotEmail').value.trim();
    const errorSpan = document.getElementById('forgotEmailError');

    errorSpan.textContent = '';
    document.getElementById('forgotEmail').classList.remove('input-error');

    if (!email) {
        document.getElementById('forgotEmail').classList.add('input-error');
        errorSpan.textContent = 'E-posta adresi gereklidir';
        return;
    }

    if (!validateEmail(email)) {
        document.getElementById('forgotEmail').classList.add('input-error');
        errorSpan.textContent = 'Geçerli bir e-posta adresi giriniz';
        return;
    }

    setTimeout(() => {
        document.getElementById('forgotPasswordForm').classList.add('hidden');
        document.getElementById('forgotPasswordSuccess').classList.remove('hidden');
    }, 500);
}

function handleGoogleLogin() {
    window.location.href = '/Account/ExternalLogin?provider=Google';
}

function handleFacebookLogin() {
    window.location.href = '/Account/ExternalLogin?provider=Facebook';
}

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        const loginModal = document.getElementById('loginModal');
        const registerModal = document.getElementById('registerModal');
        const forgotModal = document.getElementById('forgotPasswordModal');

        if (!loginModal.classList.contains('hidden')) {
            closeLoginModal();
        } else if (!registerModal.classList.contains('hidden')) {
            closeRegisterModal();
        } else if (!forgotModal.classList.contains('hidden')) {
            closeForgotPasswordModal();
        }
    }
});