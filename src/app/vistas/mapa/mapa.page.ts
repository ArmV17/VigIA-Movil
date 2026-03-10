import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import mapboxgl from 'mapbox-gl';
import { Geolocation } from '@capacitor/geolocation';

// --- NUEVAS IMPORTACIONES PARA LOS ICONOS ---
import { addIcons } from 'ionicons';
import { closeCircle } from 'ionicons/icons';

// Componentes globales de VigIA
import { CustomNavbarComponent } from '../../components/custom-navbar/custom-navbar.component';
import { LogoUtcComponent } from '../../components/logo-utc/logo-utc.component';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
  standalone: true,
  imports: [
    IonicModule, 
    CommonModule, 
    FormsModule, 
    CustomNavbarComponent, 
    LogoUtcComponent
  ]
})
export class MapaPage implements AfterViewInit, OnDestroy {
  map!: mapboxgl.Map;
  todosLosDestinos: any[] = [];
  markerA: mapboxgl.Marker | null = null;
  markerB: mapboxgl.Marker | null = null;
  
  readonly CENTER_COORDS: [number, number] = [-100.93655, 25.55701];

  panelVisible = false;
  currentTitle = '';
  currentText = '';
  currentImg = '';

  // --- REGISTRO DEL ICONO EN EL CONSTRUCTOR ---
  constructor() {
    addIcons({ 'close-circle': closeCircle });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initMap();
    }, 600);
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

  initMap() {
    (mapboxgl as any)['accessToken'] = environment.mapboxToken; 

    this.map = new mapboxgl.Map({
      container: 'map', 
      style: 'mapbox://styles/mapbox/dark-v11',
      center: this.CENTER_COORDS,
      zoom: 16,
      pitch: 45,
      antialias: true
    });

    this.map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

    this.map.on('load', () => {
      this.map.resize();
      this.cargarDatosYCapas();
      this.configurarListenersRuta();
    });
  }

  async cargarDatosYCapas() {
    try {
      const [resEdificios, resMarkers] = await Promise.all([
        fetch('assets/data/edificios.json'),
        fetch('assets/data/markers.json')
      ]);
      
      const edificiosData = await resEdificios.json();
      const markersData = await resMarkers.json();
      this.todosLosDestinos = [...edificiosData, ...markersData];

      const selectOrigen = document.getElementById('origen') as HTMLSelectElement;
      const selectDestino = document.getElementById('destino') as HTMLSelectElement;
      
      const featuresPoligonos: any[] = [];
      const featuresEtiquetas: any[] = [];

      this.todosLosDestinos.forEach(lugar => {
        if (lugar.door_coords) {
          selectOrigen.add(new Option(lugar.nombre, lugar.nombre));
          selectDestino.add(new Option(lugar.nombre, lugar.nombre));

          featuresEtiquetas.push({
            type: 'Feature',
            properties: { nombre: lugar.nombre },
            geometry: { type: 'Point', coordinates: lugar.door_coords }
          });
        }

        if (lugar.polygons && lugar.polygons[0]) {
          const coords = [...lugar.polygons];
          if (coords[0][0] !== coords[coords.length - 1][0]) coords.push(coords[0]);
          
          featuresPoligonos.push({
            type: 'Feature',
            properties: { nombre: lugar.nombre, color: lugar.color || '#3a86ff' },
            geometry: { type: 'Polygon', coordinates: [coords] }
          });
        }
      });

      this.map.addSource('lugares', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: featuresPoligonos }
      });

      this.map.addLayer({
        id: 'lugares-layer',
        type: 'fill',
        source: 'lugares',
        paint: { 'fill-color': ['get', 'color'], 'fill-opacity': 0.5 }
      });

      this.map.addSource('etiquetas', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: featuresEtiquetas }
      });

      this.map.addLayer({
        id: 'etiquetas-layer',
        type: 'symbol',
        source: 'etiquetas',
        layout: {
          'text-field': ['get', 'nombre'],
          'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
          'text-size': 11,
          'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
          'text-radial-offset': 0.5,
          'text-justify': 'auto'
        },
        paint: {
          'text-color': '#ffffff',
          'text-halo-color': 'rgba(0,0,0,0.8)',
          'text-halo-width': 1.5
        }
      });

      this.configurarClicksMapa();
    } catch (e) { 
      console.error("Error cargando datos del mapa:", e); 
    }
  }

  configurarListenersRuta() {
    const sO = document.getElementById('origen') as HTMLSelectElement;
    const sD = document.getElementById('destino') as HTMLSelectElement;
    const btn = document.getElementById('btnResetRuta');

    if (sO && sD) {
      sO.onchange = () => this.calcularRuta(sO.value, sD.value);
      sD.onchange = () => this.calcularRuta(sO.value, sD.value);
    }

    if (btn) {
      btn.onclick = () => {
        if (this.map.getLayer('ruta')) { 
          this.map.removeLayer('ruta'); 
          this.map.removeSource('ruta'); 
        }
        if (this.markerA) this.markerA.remove();
        if (this.markerB) this.markerB.remove();
        sO.value = 'GPS';
        sD.selectedIndex = 0;
        this.map.flyTo({ center: this.CENTER_COORDS, zoom: 16 });
      };
    }
  }

  async calcularRuta(origen: string, destino: string) {
    if (!origen || !destino || origen === destino) return;
    const dObj = this.todosLosDestinos.find(d => d.nombre === destino);
    if (!dObj) return;

    if (origen === "GPS") {
      try {
        const coordinates = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true, 
          timeout: 10000,           
          maximumAge: 0             
        });

        this.ejecutarPeticionRuta(
          [coordinates.coords.longitude, coordinates.coords.latitude], 
          dObj.door_coords
        );
      } catch (e) {
        alert("⚠️ No se pudo obtener la ubicación exacta. Asegúrate de estar en un lugar abierto y tener el GPS en modo 'Alta Precisión'.");
      }
    } else {
      const oObj = this.todosLosDestinos.find(o => o.nombre === origen);
      if (oObj) this.ejecutarPeticionRuta(oObj.door_coords, dObj.door_coords);
    }
  }

  async ejecutarPeticionRuta(start: [number, number], end: [number, number]) {
    try {
      const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${environment.mapboxToken}`;
      const res = await fetch(url);
      const json = await res.json();
      
      if (!json.routes || !json.routes[0]) return;

      if (this.map.getSource('ruta')) {
        (this.map.getSource('ruta') as mapboxgl.GeoJSONSource).setData(json.routes[0].geometry);
      } else {
        this.map.addLayer({
          id: 'ruta',
          type: 'line',
          source: { 
            type: 'geojson', 
            data: { type: 'Feature', properties: {}, geometry: json.routes[0].geometry } 
          },
          paint: { 'line-color': '#4db8ff', 'line-width': 5 }
        });
      }

      if (this.markerA) this.markerA.remove();
      if (this.markerB) this.markerB.remove();
      this.markerA = new mapboxgl.Marker({ color: '#00b4d8' }).setLngLat(start).addTo(this.map);
      this.markerB = new mapboxgl.Marker({ color: '#ff4d4d' }).setLngLat(end).addTo(this.map);
      
      this.map.fitBounds(new mapboxgl.LngLatBounds(start, start).extend(end), { padding: 80 });
    } catch (e) { 
      console.error("Error calculando la ruta:", e); 
    }
  }

  configurarClicksMapa() {
    this.map.on('click', 'lugares-layer', (e) => {
      const name = e.features![0].properties!['nombre'];
      const item = this.todosLosDestinos.find(x => x.nombre === name);
      if (!item) return;

      this.currentTitle = name;
      this.currentText = item.informacion || 'Sin información adicional.';
      this.currentImg = item.imagen ? `assets/imgs/img/${item.imagen}` : `assets/imgs/img/db_mapa_default.webp`;
      this.panelVisible = true;
    });
  }

  closeInfoPanel() { 
    this.panelVisible = false; 
  }
}