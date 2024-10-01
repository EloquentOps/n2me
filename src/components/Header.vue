<template>
    <div class="header">
        <div class="header-content">
            <div class="header-logo">
                <h1><router-link to="/">n2me</router-link> → {{ $route.name }}</h1>
            </div>

            <div class="header-menu">
                <a class="header-menu-toggle" href="" @click.prevent="toggleMenu">
                    |||
                </a>
                <ul class="header-menu-list" v-if="isMenuOpen" @click="toggleMenu">
                    <li>
                        <router-link to="/">Add</router-link>
                    </li>

                    <li>
                        <router-link to="/ask">Ask</router-link>
                    </li>

                    <li>
                        <router-link to="/settings">Settings</router-link>
                    </li>

                </ul>
            </div>
        </div>
    </div>
</template>


<script>

export default {
    data() {
        return {
            isDev: import.meta.env.DEV
        }
    },
    data() {
        return {
            isMenuOpen: false
        }
    },
    methods: {
        toggleMenu() {
            this.isMenuOpen = !this.isMenuOpen
        }
    },
    async mounted() {
    }
}
</script>


<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    background-color: #eee;
    color: #000;
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1;

    padding: 1rem;
    max-width: 800px;
    margin: 0 auto;
}

.header-logo {
    flex: 1;
}

.header-menu {

}

h1 {
    color: #444;
    margin: 0;
}

a {
    text-decoration: none;
}

.header-menu-list a {
    text-decoration: none;
    color: #000;
    padding: 1.5rem 3rem;
    display: block;
    border-radius: .5rem;
}

.header-menu-list a:hover {
    background-color: #fff;
}


.header-menu-list {
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #eee;
    list-style: none;
    margin: 0;
    padding: 0;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.header-menu-toggle {
    text-decoration: none;
    color: #999;
    display: block;
    border-radius: .5rem;
    padding: 1rem;
    font-size: 1.2rem;
    background-color: #fff;
    transform: rotate(90deg);
}

</style>