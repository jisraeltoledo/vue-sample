<template>
  <div>
    <li class="nav-item dropdown">
      <a
        class="nav-link dropdown-toggle"
        href="#"
        id="pagesDropdown"
        role="button"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <i class="fas fa-fw fa-folder"></i>
        <span>Proyectos</span>
      </a>
      <div class="dropdown-menu" aria-labelledby="pagesDropdown">
        <h6 class="dropdown-header">Proyectos:</h6>
        <router-link tag="li" to="/create-project">
          <a class="dropdown-item">Nuevo proyecto</a>
        </router-link>
        <router-link tag="li" to="/list-project">
          <a class="dropdown-item">Listado proyectos</a>
        </router-link>
      </div>
    </li>
  </div>
</template>


<script>
export default {
  name: "menu-moderador",
  props: {}
};
</script>