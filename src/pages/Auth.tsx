import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";

const emailSchema = z.string().email("Email inválido");
const passwordSchema = z.string().min(6, "La contraseña debe tener al menos 6 caracteres");

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validar email
      const emailValidation = emailSchema.safeParse(email);
      if (!emailValidation.success) {
        toast.error(emailValidation.error.errors[0].message);
        setLoading(false);
        return;
      }

      // Validar contraseña solo si no es recuperación
      if (!isForgotPassword) {
        const passwordValidation = passwordSchema.safeParse(password);
        if (!passwordValidation.success) {
          toast.error(passwordValidation.error.errors[0].message);
          setLoading(false);
          return;
        }
      }

      if (isForgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("¡Revisa tu email para recuperar tu contraseña!");
        setIsForgotPassword(false);
      } else if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("¡Bienvenido!");
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          },
        });
        if (error) throw error;
        toast.success("¡Cuenta creada exitosamente!");
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error.message || "Error al autenticar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 px-4">
      <Card className="w-full max-w-md gradient-card">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">
            El Ocampense
          </CardTitle>
          <CardDescription className="mt-2">
            {isForgotPassword
              ? "Recupera tu contraseña"
              : isLogin
              ? "Inicia sesión en tu cuenta"
              : "Crea tu cuenta"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {!isForgotPassword && (
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? "Cargando..."
                : isForgotPassword
                ? "Enviar email de recuperación"
                : isLogin
                ? "Iniciar Sesión"
                : "Registrarse"}
            </Button>
          </form>
          
          <div className="mt-4 space-y-2 text-center">
            {!isForgotPassword && (
              <>
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors block w-full"
                >
                  {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
                </button>
                {isLogin && (
                  <button
                    onClick={() => setIsForgotPassword(true)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors block w-full"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                )}
              </>
            )}
            {isForgotPassword && (
              <button
                onClick={() => setIsForgotPassword(false)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors block w-full"
              >
                Volver al inicio de sesión
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
