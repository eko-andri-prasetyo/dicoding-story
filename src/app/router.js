import { HomeView } from '../mvp/views/home-view.js';
import { LoginView } from '../mvp/views/login-view.js';
import { RegisterView } from '../mvp/views/register-view.js';
import { StoriesView } from '../mvp/views/stories-view.js';
import { AddView } from '../mvp/views/add-view.js';
import { MapView } from '../mvp/views/map-view.js';
import { DetailView } from '../mvp/views/detail-view.js';
import { NotFoundView } from '../mvp/views/not-found-view.js';
import { SavedStoriesView } from '../mvp/views/saved-stories-view.js';

export class Router {
  constructor(root){
    this.root = root;
    this.currentView = null;
    this.routes = [
      { path: /^#\/$|^#$/, view: HomeView },
      { path: /^#\/login$/, view: LoginView },
      { path: /^#\/register$/, view: RegisterView },
      { path: /^#\/stories$/, view: StoriesView },
      { path: /^#\/saved$/, view: SavedStoriesView },
      { path: /^#\/add$/, view: AddView },
      { path: /^#\/map$/, view: MapView },
      { path: /^#\/detail\/(.+)$/, view: DetailView },
    ];
  }

  navigate(hash){
    try {
      const route = this.routes.find(r => r.path.test(hash));
      const params = route && (hash.match(route.path) || []).slice(1);
      const ViewClass = route ? route.view : NotFoundView;
      
      const render = () => {
        try {
          if (this.currentView?.destroy) this.currentView.destroy();
          this.currentView = new ViewClass();
          this.root.innerHTML = this.currentView.render();
          if (this.currentView.afterRender) this.currentView.afterRender(...(params || []));
        } catch (error) {
          console.error('Error rendering view:', error);
          this.root.innerHTML = '<div class="card"><h2>Error</h2><p>Terjadi kesalahan saat memuat halaman.</p></div>';
        }
      };

      if (document.startViewTransition){
        document.startViewTransition(render);
      } else {
        render();
      }
    } catch (error) {
      console.error('Navigation error:', error);
      this.root.innerHTML = '<div class="card"><h2>Error</h2><p>Terjadi kesalahan navigasi.</p></div>';
    }
  }
}