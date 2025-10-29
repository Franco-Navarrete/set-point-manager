import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, Shield, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import LeagueSelector from "./LeagueSelector";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      if (session?.user) {
        checkAdminStatus(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        checkAdminStatus(session.user.id);
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    
    setIsAdmin(!!data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  // Navegación: desktop y móvil
  const desktopPrimary = [
    { name: "Inicio", path: "/" },
  ];
  const fixtureTablaItems = [
    { name: "Fixture", path: "/fixture" },
    { name: "Tabla", path: "/tabla" },
  ];

  const moreNavItems = [
    { name: "Equipos", path: "/equipos" },
    { name: "Noticias", path: "/noticias" },
    { name: "Sobre Nosotros", path: "/sobre-nosotros" },
    { name: "Contacto", path: "/contacto" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4 h-16">
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            {logoError ? (
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-glow">
                <span className="text-primary-foreground font-bold text-xl">V</span>
              </div>
            ) : (
              <img
                src="/el-ocampense-logo.svg"
                alt="El Ocampense"
                className="h-10 w-auto object-contain"
                onError={() => setLogoError(true)}
              />
            )}
            <span className="font-bold text-xl hidden lg:inline">El Ocampense</span>
          </Link>

          {/* Eliminamos el selector aquí para moverlo entre el menú y el botón Ingresar */}

          <div className="hidden md:flex items-center space-x-1">
            {desktopPrimary.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button variant={isActive(item.path) ? "default" : "ghost"}>
                  {item.name}
                </Button>
              </Link>
            ))}

            {/* Dropdown Fixture/Tabla */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={fixtureTablaItems.some((i) => isActive(i.path)) ? "default" : "ghost"}>
                  Fixture / Tabla
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-popover border-border z-50">
                {fixtureTablaItems.map((item) => (
                  <DropdownMenuItem key={item.path} onClick={() => navigate(item.path)}>
                    {item.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={moreNavItems.some((i) => isActive(i.path)) ? "default" : "ghost"}>
                  Más
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-popover border-border z-50">
                {moreNavItems.map((item) => (
                  <DropdownMenuItem key={item.path} onClick={() => navigate(item.path)}>
                    {item.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Selector de liga/evento colocado entre el menú y el botón Ingresar */}
            <div className="mx-2 w-56">
              <LeagueSelector />
            </div>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Mi Cuenta
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover border-border z-50">
                  {isAdmin && (
                    <>
                      <DropdownMenuItem onClick={() => navigate("/admin")}>
                        <Shield className="w-4 h-4 mr-2" />
                        Panel Admin
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={() => navigate("/change-password")}> 
                    <KeyRound className="w-4 h-4 mr-2" />
                    Cambiar Contraseña
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="default" size="sm" onClick={() => navigate("/auth")}> 
                Ingresar
              </Button>
            )}
          </div>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-border">
            <div className="px-2 mb-4">
              <LeagueSelector />
            </div>
            {/* Menú móvil: Inicio, Fixture, Tabla y Más */}
            {[...desktopPrimary, ...fixtureTablaItems, ...moreNavItems].map((item) => (
              <Link key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)}>
                <Button variant={isActive(item.path) ? "default" : "ghost"} className="w-full justify-start">
                  {item.name}
                </Button>
              </Link>
            ))}
            {user ? (
              <>
                {isAdmin && (
                  <Button variant="outline" className="w-full justify-start" onClick={() => { navigate("/admin"); setMobileMenuOpen(false); }}>
                    <Shield className="w-4 h-4 mr-2" />
                    Panel Admin
                  </Button>
                )}
                <Button variant="outline" className="w-full justify-start" onClick={() => { navigate("/change-password"); setMobileMenuOpen(false); }}>
                  <KeyRound className="w-4 h-4 mr-2" />
                  Cambiar Contraseña
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <Button className="w-full" onClick={() => { navigate("/auth"); setMobileMenuOpen(false); }}>
                Ingresar
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
