<template>
  <!-- Sidebar -->

  <ul class="sidebar navbar-nav">
    <br />

    <li class="nav-item" v-if="!hasRol(myroles.ventas)">
      <router-link tag="li" to="/projects/all">
        <a class="nav-link">
          <i class="fas fa-list"></i>
          <span> Todos los productos</span>
        </a>
      </router-link>
    </li>

    <li class="nav-item" v-if="notHasRol(myroles.ventas)">
      <router-link tag="li" to="/projects/proceso">
        <a class="nav-link">
          <i class="fas fa-spinner"></i>
          <span> En proceso</span>
        </a>
      </router-link>
    </li>

    <li class="nav-item" v-if="notHasRol(myroles.ventas)">
      <router-link tag="li" to="/projects/revision">
        <a class="nav-link">
          <i class="fas fa-check-double"></i>
          <span> En revisión</span>
        </a>
      </router-link>
    </li>

    <li class="nav-item" v-if="hasRol(myroles.ventas) && notHasRol(myroles.super_admin)">
      <router-link tag="li" to="/projects/publicado">
        <a class="nav-link">
          <i class="fas fa-globe-americas"></i>
          <span> Productos </span>
        </a>
      </router-link>
    </li>

    <li class="nav-item" v-if="notHasRol(myroles.ventas)">
      <router-link tag="li" to="/projects/publicado">
        <a class="nav-link">
          <i class="fas fa-globe-americas"></i>
          <span> Publicados</span>
        </a>
      </router-link>
    </li>

    <li class="nav-item"  v-if="hasRol(myroles.moderador)">
      <router-link tag="li" to="/projects/retirado">
        <a class="nav-link">
          <i class="fas fa-minus-circle"></i>
          <span> Retirados</span>
        </a>
      </router-link>
    </li>

    <li class="nav-item">
      <router-link tag="li" to="/projects/favorites">
        <a class="nav-link">
          <i class="fas fa-star"></i>
          <span> Favoritos</span>
        </a>
      </router-link>
    </li>

    <li class="nav-item" v-if="hasRol(myroles.ventas)">
      <router-link tag="li" to="/collections">
        <a class="nav-link">
          <i class="fas fa-layer-group"></i>
          <span> Colecciones</span>
        </a>
      </router-link>
    </li>

    <li class="nav-item" v-if="hasRol(myroles.moderador)">
      <router-link tag="li" to="/fields">
        <a class="nav-link">
          <i class="fas fa-align-justify"></i>
          <span> Campos </span>
        </a>
      </router-link>
    </li>

    <li class="nav-item" v-if="hasRol(myroles.estructuras) || hasRol(myroles.moderador)">
      <router-link tag="li" to="/create-project">
        <a class="nav-link">
          <button class="btn btn-success">
            <i class="fas fa-plus-circle"></i>
            <small> Producto | Familia</small>
          </button>
        </a>
      </router-link>
    </li>

    <li class="nav-item" v-if="hasRol(myroles.moderador)">
      <router-link tag="li" to="/fields/new">
        <a class="nav-link">
          <button class="btn btn-success">
            <i class="fas fa-plus-circle"></i>
            <small> Campo</small>
          </button>
        </a>
      </router-link>
    </li>

    <li class="nav-item" v-if="hasRol(myroles.moderador)">
      <router-link tag="li" to="/font-create">
        <a class="nav-link">
          <button class="btn btn-success">
            <i class="fas fa-plus-circle"></i>
            <small> Fuente </small>
          </button>
        </a>
      </router-link>
    </li>
    
  </ul>
</template>

<script>
import store from "@/store";
import { roles } from "@/router";
export default {
  name: "side-bar",
  components: {
   
  },
  data() {
    return {
      isMounted: false
    };
  },
  created() {},
  mounted() {
    this.isMounted = true;
  },
  computed: {
    myroles() {
      return roles;
    }
  },
  methods: {
    
  }
};
</script>
