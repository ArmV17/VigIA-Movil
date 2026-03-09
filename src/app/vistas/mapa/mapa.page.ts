import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import mapboxgl from 'mapbox-gl';

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
  
  // Tu Token Personal
  private readonly MAPBOX_TOKEN = 'pk.eyJ1Ijoic2FsdmFoZHotMTEiLCJhIjoiY2x3czBoYTJiMDI1OTJqb2VmZzVueG1ocCJ9.dDJweS7MAR5N2U3SF64_Xw';
  readonly CENTER_COORDS: [number, number] = [-100.93655, 25.55701];

  // Variables para el Panel de Información
  panelVisible = false;
  currentTitle = '';
  currentText = '';
  currentImg = '';

  constructor() {}

  ngAfterViewInit() {
    // Timeout para asegurar que el div #map esté listo en el DOM
    setTimeout(() => {
      this.initMap();
    }, 600);
  }

  ngOnDestroy() {
    // Limpieza de memoria al salir de la vista
    if (this.map) {
      this.map.remove();
    }
  }

  initMap() {
    // 🔥 SOLUCIÓN AL ERROR: Acceso por corchetes para evitar el error de "accessToken is immutable"
    (mapboxgl as any)['accessToken'] = this.MAPBOX_TOKEN; 

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
      // Carga de archivos JSON desde la carpeta assets
      const [resEdificios, resMarkers] = await Promise.all([
        fetch('assets/data/edificios.json'),
        fetch('assets/data/markers.json')
      ]);
      
      const edificiosData = await resEdificios.json();
      const markersData = await resMarkers.json();
      this.todosLosDestinos = [...edificiosData, ...markersData];

      const selectOrigen = document.getElementById('origen') as HTMLSelectElement;
      const selectDestino = document.getElementById('destino') as HTMLSelectElement;
      const features: any[] = [];

      this.todosLosDestinos.forEach(lugar => {
        // Llenar selects de ruta
        if (lugar.door_coords) {
          selectOrigen.add(new Option(lugar.nombre, lugar.nombre));
          selectDestino.add(new Option(lugar.nombre, lugar.nombre));
        }

        // Crear polígonos de edificios en el mapa
        if (lugar.polygons && lugar.polygons[0]) {
          const coords = [...lugar.polygons];
          // Cerrar el polígono si el último punto no es igual al primero
          if (coords[0][0] !== coords[coords.length - 1][0]) coords.push(coords[0]);
          
          features.push({
            type: 'Feature',
            properties: { nombre: lugar.nombre, color: lugar.color || '#3a86ff' },
            geometry: { type: 'Polygon', coordinates: [coords] }
          });
        }
      });

      this.map.addSource('lugares', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: features }
      });

      this.map.addLayer({
        id: 'lugares-layer',
        type: 'fill',
        source: 'lugares',
        paint: { 'fill-color': ['get', 'color'], 'fill-opacity': 0.5 }
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
      const update = () => this.calcularRuta(sO.value, sD.value);
      sO.onchange = update;
      sD.onchange = update;
    }

    if (btn) {
      btn.onclick = () => {
        // Limpiar ruta y marcadores
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
      navigator.geolocation.getCurrentPosition(pos => {
        this.ejecutarPeticionRuta([pos.coords.longitude, pos.coords.latitude], dObj.door_coords);
      }, () => alert("⚠️ Activa tu GPS en los ajustes del celular"));
    } else {
      const oObj = this.todosLosDestinos.find(o => o.nombre === origen);
      if (oObj) this.ejecutarPeticionRuta(oObj.door_coords, dObj.door_coords);
    }
  }

  async ejecutarPeticionRuta(start: [number, number], end: [number, number]) {
    try {
      const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${this.MAPBOX_TOKEN}`;
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

      // Actualizar marcadores de inicio y fin
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