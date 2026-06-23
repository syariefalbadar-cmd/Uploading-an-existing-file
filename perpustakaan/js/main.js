document.addEventListener('DOMContentLoaded', () => {
    const appModel = new AppModel();
    const appView = new AppView();
    const appController = new AppController(appModel, appView);
});
