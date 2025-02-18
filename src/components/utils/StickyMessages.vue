<script>
import { useMessagesStore } from '@/stores/messages';
import { mapState, mapActions } from 'pinia';

export default {
    name: 'AppMessages',
    computed: {
        ...mapState(useMessagesStore, ['messages'])
    },
    methods: {
        ...mapActions(useMessagesStore, ['deleteMessageAction', 'pushMessageAction', 'clearMessageAction']),
        removeMsg(index) {
            this.deleteMessageAction(index);
        },
        autoRemoveMsg(index, type) {
            let timeout = 10000;
            if (type === 'error') {
                timeout = 15000;
            }
            setTimeout(() => {
                this.removeMsg(index);
            }, timeout);
        }
    },
    // He implementado el borrado automático de mensajes. Dejo comentado el código siguiente
    // puesto que en clase no se ha explicado cómo hacerlo. 😊
    watch: {
        // Observa cambios en la propiedad 'messages'
        messages: {
            // Define un manejador que se ejecuta cuando 'messages' cambia
            handler(newMessages) {
                // Itera sobre cada mensaje nuevo en 'newMessages'
                newMessages.forEach((msg, index) => {
                    // Llama a la función 'autoRemoveMsg' pasando el índice y el tipo de mensaje
                    this.autoRemoveMsg(index, msg.type);
                });
            },
            // Indica que Vue debe observar cambios profundos en 'messages'
            deep: true
        }
    }
}
</script>

<template>
    <div id="msgContainer">
        <div v-for="(msg, index) in messages" :key="index" :class="['msg', msg.type]" @dblclick="removeMsg(index)">
            <p>{{ msg.message }}</p>
            <button @click="removeMsg(index)">x</button>
        </div>
    </div>
</template>

<style scoped>
#msgContainer {
    position: sticky;
    top: 100px;
    left: 10px;
    z-index: 1000;
    max-width: 300px;
}

#msgContainer:empty {
    display: none;
}

.msg {
    background-color: #f9f9f9;
    color: #333;
    padding: 10px;
    margin: 10px;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s ease, color 0.3s ease;
}

.msg p {
    margin: 0;
    flex-grow: 1;
}

.msg button {
    background: none;
    border: none;
    color: #888;
    font-size: 16px;
    cursor: pointer;
    transition: color 0.3s ease;
}

.msg button:hover {
    color: #333;
}

.error {
    border-left: 5px solid rgba(255, 0, 0, 0.8);
}

.info {
    border-left: 5px solid rgba(0, 0, 255, 0.8);
}

.success {
    border-left: 5px solid rgba(0, 128, 0, 0.8);
}

.warning {
    border-left: 5px solid rgba(255, 255, 0, 0.8);
}
</style>