import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiClient } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2, HardDrive } from 'lucide-react';

const ActivateAccountPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const activateAccount = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid activation link');
        return;
      }

      try {
        const response = await apiClient.activateAccount(token);
        
        if (response.success) {
          setStatus('success');
          setMessage('Your account has been activated successfully!');
        } else {
          setStatus('error');
          setMessage(response.message || 'Activation failed');
        }
      } catch (error: any) {
        setStatus('error');
        setMessage(error.message || 'An error occurred during activation');
      }
    };

    activateAccount();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
            <HardDrive className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">CloudDrive</h1>
        </div>

        <Card className="border-0 shadow-xl text-center">
          <CardContent className="pt-12 pb-8">
            {status === 'loading' && (
              <>
                <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Activating account...</h2>
                <p className="text-muted-foreground">
                  Please wait while we activate your account.
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="w-20 h-20 mx-auto rounded-full bg-success/10 flex items-center justify-center mb-6">
                  <CheckCircle className="w-10 h-10 text-success" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Account Activated!</h2>
                <p className="text-muted-foreground mb-6">{message}</p>
                <Button 
                  onClick={() => navigate('/login')}
                  className="w-full gradient-primary text-primary-foreground"
                >
                  Go to Login
                </Button>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="w-20 h-20 mx-auto rounded-full bg-destructive/10 flex items-center justify-center mb-6">
                  <XCircle className="w-10 h-10 text-destructive" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Activation Failed</h2>
                <p className="text-muted-foreground mb-6">{message}</p>
                <Link to="/register">
                  <Button variant="outline" className="w-full">
                    Try registering again
                  </Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ActivateAccountPage;
