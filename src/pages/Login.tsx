import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useAppContext } from '@/contexts/AppContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const { login } = useAppContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      login({
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: name || email.split('@')[0]
      });
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen gradient-animated flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fadeInUp">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 mb-4 hover-glow">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            AI Education Platform
          </h1>
          <p className="text-white/80 text-lg">
            Transform complex concepts into understanding
          </p>
        </div>

        {/* Login Form */}
        <Card className="glass-card p-8 border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 glass-card border-white/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Name (Optional)
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="glass-card border-white/20"
              />
            </div>

            <Button
              type="submit"
              className="w-full btn-hero group"
              size="lg"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              No account needed. Your data is stored locally.
            </p>
          </div>
        </Card>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="text-white/80">
            <div className="text-2xl font-bold">🧠</div>
            <p className="text-sm mt-1">AI Analysis</p>
          </div>
          <div className="text-white/80">
            <div className="text-2xl font-bold">📚</div>
            <p className="text-sm mt-1">Multi-level Learning</p>
          </div>
          <div className="text-white/80">
            <div className="text-2xl font-bold">🔊</div>
            <p className="text-sm mt-1">Text-to-Speech</p>
          </div>
        </div>
      </div>
    </div>
  );
}