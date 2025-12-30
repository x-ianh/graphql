// Custom modal dialogs matching the website theme
class Modal {
    // Show a confirmation dialog
    static confirm(message, title = "Confirm") {
        return new Promise((resolve) => {
            // Create modal overlay
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(5px);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                animation: fadeIn 0.2s ease-out;
            `;

            // Create modal content
            const modal = document.createElement('div');
            modal.style.cssText = `
                background: linear-gradient(135deg, #2d3348 0%, #1e142c 100%);
                border: 1px solid rgba(106, 13, 173, 0.3);
                border-radius: 16px;
                padding: 30px;
                max-width: 400px;
                width: 90%;
                box-shadow: 0 8px 32px rgba(106, 13, 173, 0.3);
                animation: slideUp 0.3s ease-out;
            `;

            // Modal HTML
            modal.innerHTML = `
                <h2 style="
                    margin: 0 0 15px;
                    font-size: 1.5rem;
                    background: linear-gradient(90deg, var(--primary), var(--secondary));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    font-weight: 600;
                ">${title}</h2>
                <p style="
                    margin: 0 0 25px;
                    color: #e0e0e0;
                    font-size: 1rem;
                    line-height: 1.5;
                ">${message}</p>
                <div style="
                    display: flex;
                    gap: 15px;
                    justify-content: flex-end;
                ">
                    <button id="modal-cancel" style="
                        padding: 12px 24px;
                        background: rgba(255, 255, 255, 0.1);
                        color: #e0e0e0;
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        border-radius: 8px;
                        font-size: 1rem;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">Cancel</button>
                    <button id="modal-confirm" style="
                        padding: 12px 24px;
                        background: linear-gradient(135deg, var(--primary), var(--primary-dark));
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-size: 1rem;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">Confirm</button>
                </div>
            `;

            overlay.appendChild(modal);
            document.body.appendChild(overlay);

            // Add animations
            const style = document.createElement('style');
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { 
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                #modal-cancel:hover {
                    background: rgba(255, 255, 255, 0.15);
                    border-color: rgba(255, 255, 255, 0.3);
                }
                #modal-confirm:hover {
                    background: linear-gradient(135deg, var(--primary-dark), #8A2BE2);
                    transform: translateY(-2px);
                    box-shadow: 0 6px 16px rgba(106, 13, 173, 0.4);
                }
            `;
            document.head.appendChild(style);

            // Handle button clicks
            const confirmBtn = modal.querySelector('#modal-confirm');
            const cancelBtn = modal.querySelector('#modal-cancel');

            const closeModal = (result) => {
                overlay.style.animation = 'fadeOut 0.2s ease-out';
                setTimeout(() => {
                    document.body.removeChild(overlay);
                    document.head.removeChild(style);
                    resolve(result);
                }, 200);
            };

            confirmBtn.addEventListener('click', () => closeModal(true));
            cancelBtn.addEventListener('click', () => closeModal(false));
            
            // Close on overlay click
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) closeModal(false);
            });

            // Close on Escape key
            const escapeHandler = (e) => {
                if (e.key === 'Escape') {
                    closeModal(false);
                    document.removeEventListener('keydown', escapeHandler);
                }
            };
            document.addEventListener('keydown', escapeHandler);
        });
    }

    // Show an alert dialog
    static alert(message, title = "Notice") {
        return new Promise((resolve) => {
            // Similar to confirm but with only one button
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(5px);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                animation: fadeIn 0.2s ease-out;
            `;

            const modal = document.createElement('div');
            modal.style.cssText = `
                background: linear-gradient(135deg, #2d3348 0%, #1e142c 100%);
                border: 1px solid rgba(106, 13, 173, 0.3);
                border-radius: 16px;
                padding: 30px;
                max-width: 400px;
                width: 90%;
                box-shadow: 0 8px 32px rgba(106, 13, 173, 0.3);
                animation: slideUp 0.3s ease-out;
            `;

            modal.innerHTML = `
                <h2 style="
                    margin: 0 0 15px;
                    font-size: 1.5rem;
                    background: linear-gradient(90deg, var(--primary), var(--secondary));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    font-weight: 600;
                ">${title}</h2>
                <p style="
                    margin: 0 0 25px;
                    color: #e0e0e0;
                    font-size: 1rem;
                    line-height: 1.5;
                ">${message}</p>
                <div style="
                    display: flex;
                    justify-content: flex-end;
                ">
                    <button id="modal-ok" style="
                        padding: 12px 24px;
                        background: linear-gradient(135deg, var(--primary), var(--primary-dark));
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-size: 1rem;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">OK</button>
                </div>
            `;

            overlay.appendChild(modal);
            document.body.appendChild(overlay);

            const closeModal = () => {
                overlay.style.animation = 'fadeOut 0.2s ease-out';
                setTimeout(() => {
                    document.body.removeChild(overlay);
                    resolve();
                }, 200);
            };

            modal.querySelector('#modal-ok').addEventListener('click', closeModal);
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) closeModal();
            });
        });
    }
}

export default Modal;