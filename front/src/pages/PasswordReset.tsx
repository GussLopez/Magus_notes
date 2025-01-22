import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Notification from '@/components/Notification';
import { sendResetPasswordEmail, resetPassword } from '@/lib/auth';
import { Eye, EyeOff } from 'lucide-react';

export default function PasswordReset() {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [redirectCountdown, setRedirectCountdown] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await sendResetPasswordEmail(email);
      showNotification(response.message, 'success');
      setStep(2);
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : 'Error al enviar el código',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationCodeChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);
      
      if (value !== '' && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        if (nextInput) {
          (nextInput as HTMLInputElement).focus();
        }
      }
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showNotification('Las contraseñas no coinciden', 'error');
      return;
    }
    setIsLoading(true);
    try {
      const code = verificationCode.join('');
      const response = await resetPassword(email, code, newPassword);
      showNotification(response.message, 'success');
      setStep(4);
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : 'Error al restablecer la contraseña',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 4) {
      timer = setInterval(() => {
        setRedirectCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step]);

  useEffect(() => {
    if (redirectCountdown === 0) {
      navigate('/login');
    }
  }, [redirectCountdown, navigate]);

  const togglePasswordVisibility = (field: 'new' | 'confirm') => {
    if (field === 'new') {
      setShowNewPassword(!showNewPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-cyan-50 to-blue-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <img src="/placeholder.svg?height=100&width=100" alt="Magus Notes Logo" className="mx-auto mb-8 w-24 h-24" />
        <h1 className="text-3xl font-bold text-center mb-6">Magus Notes</h1>
        <h2 className="text-2xl font-bold text-center mb-8">Restablecer Contraseña</h2>

        {step === 1 && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label htmlFor="email">Correo Electrónico</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                placeholder="tu@correo.com"
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Enviando...' : 'Enviar Código de Verificación'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label htmlFor="verificationCode">Código de Verificación</label>
              <div className="flex justify-between mt-1">
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleVerificationCodeChange(index, e.target.value)}
                    className="w-12 h-12 text-center text-lg"
                    maxLength={1}
                    required
                  />
                ))}
              </div>
            </div>
            <div className="relative">
              <label htmlFor="newPassword">Nueva Contraseña</label>
              <input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={isLoading}
                placeholder="Nueva contraseña"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              >
                {showNewPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
              </button>
            </div>
            <div className="relative">
              <label htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                placeholder="Confirmar nueva contraseña"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
              </button>
            </div>
            <button 
              type="submit" 
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Restableciendo...' : 'Restablecer Contraseña'}
            </button>
          </form>
        )}

        {step === 4 && (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">¡Contraseña restablecida exitosamente!</h2>
            <p className="mb-4">Serás redirigido al inicio de sesión en {redirectCountdown} segundos.</p>
            <button 
              onClick={() => navigate('/login')} 
              className="bg-cyan-500 hover:bg-cyan-600 text-white"
            >
              Ir al Inicio de Sesión
            </button>
          </div>
        )}
      </div>
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}

