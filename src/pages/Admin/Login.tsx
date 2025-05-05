
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { signIn } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error('Login error:', error);
        setError('Email ou senha inválidos. Tente novamente.');
        toast.error('Falha no login. Verifique suas credenciais.');
      } else {
        toast.success('Login realizado com sucesso!');
        navigate('/admin/dashboard');
      }
    } catch (err) {
      console.error('Unexpected error during login:', err);
      setError('Ocorreu um erro inesperado. Tente novamente mais tarde.');
      toast.error('Erro inesperado. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 flex justify-center items-center">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-2xl font-display font-bold mb-6 text-center">
              Área Administrativa
            </h1>
            
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4">
                  {error}
                </div>
              )}
              
              <div className="mb-4">
                <Label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3"
                  required
                />
              </div>
              
              <div className="mb-6">
                <Label htmlFor="password" className="block text-sm font-medium mb-1">
                  Senha
                </Label>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 px-4 rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-70"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
