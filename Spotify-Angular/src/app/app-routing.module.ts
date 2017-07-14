import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchComponent } from './search/search.component';
import { AlbumComponent } from './album/album.component';
import { ArtistComponent } from './artist/artist.component';
import { TrackComponent } from './track/track.component';

const routes: Routes = [

  { path: 'search', component: SearchComponent },

  { path: 'artists/:id', component: ArtistComponent },

  { path: 'albums/:id', component: AlbumComponent },

  { path: 'tracks/:id', component: TrackComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
