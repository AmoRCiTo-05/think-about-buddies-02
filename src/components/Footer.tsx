
import { Button } from '@/components/ui/button';
import { Heart, Instagram, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-secondary/50 py-12 px-4 border-t border-border">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-primary rounded"></div>
              <span className="font-bold text-gradient">Think@Friend</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Let them know what you think. Built with <Heart className="inline h-4 w-4 text-red-400" /> for GenZ.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="#about" className="hover:text-primary transition-colors">About</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">How it Works</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Connect</h4>
            <div className="flex space-x-3">
              <Button 
                size="sm" 
                variant="outline" 
                className="border-primary/30 hover:bg-primary/10"
                asChild
              >
                <a href="https://instagram.com/aanshchopra" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-4 w-4" />
                </a>
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="border-primary/30 hover:bg-primary/10"
                asChild
              >
                <a href="mailto:aanshchopra33@gmail.com">
                  <Mail className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-sm text-muted-foreground">
            © 2025 Think@Friend. Made for the real ones.
          </p>
          <p className="text-sm text-muted-foreground">
            Version 1.0 • Built by: Aansh Chopra and <a 
              href="https://iam-sahil.github.io" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary hover:underline"
            >
              Sahil Rana
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
