describe('appController.js', () => {
    let appController;

    beforeEach(() => {
        appController = new AppController();
    });

    describe('renderOrder()', () => {
        let orderElem;

        beforeEach(() => {
            appController.order.addPizza(new Pizza(['bacon', 'ham'], 'small'));
            appController.order.addPizza(new Pizza(['ham'], 'small'));

            orderElem = document.createElement('div');
            orderElem.classList.add('order');
            document.body.appendChild(orderElem);
        });

        afterEach(() => {
           orderElem.parentNode.removeChild(orderElem);
        });

        it('should have correct bindings for pizza', () => {
            appController.renderPizzasInOrder();

            const pizza = orderElem.querySelectorAll('.pizza')[0];
            const size = pizza.querySelector('.size').textContent;
            const toppings = pizza.querySelector('.toppings').textContent;
            const price = pizza.querySelector('.price').textContent;

            expect(size).toBe('small');
            expect(toppings).toBe('bacon, ham');
            expect(price).toBe('1.3$');
        });

        it('should have correct number of pizzas in order', () => {
            appController.renderPizzasInOrder();

            expect(orderElem.querySelectorAll('.pizza').length).toBe(2);
        });

        it('should have correct message for no pizza', () => {
            appController.order.pizzas = [];
            appController.renderPizzasInOrder();

            expect(orderElem.textContent).toBe('No pizzas in order');
        });

        it('should invoke remove pizza from order', () => {
            appController.renderPizzasInOrder();
            const removeButton = orderElem.querySelectorAll('.pizza')[0].querySelector('button');
            removeButton.click();
        });
    });

    describe('init()', () => {
        it('should call init methods', async () => {
            const initOrderSpy = spyOn(appController, 'initOrder').and.returnValue(Promise.resolve());
            const renderOrderSpy = spyOn(appController, 'renderOrder');

            await appController.init();

            expect(initOrderSpy).toHaveBeenCalled();
            expect(renderOrderSpy).toHaveBeenCalled();
        });
    });

    describe('initOrder()', () => {
        const responseData = [
            {
                "toppings": ["ham", "bacon"],
                "size": "large"
            },
            {
                "toppings": ["corn", "olives"],
                "size": "medium"
            }
        ];

        it('should set pizzas to order', async (done) => {
            const requestSpy = spyOnProperty(appController, 'pizzas').and.returnValue(Promise.resolve(responseData));
            const addPizzaSpy = spyOn(appController.order, 'addPizza');

            await appController.initOrder();

            expect(requestSpy).toHaveBeenCalled();
            expect(addPizzaSpy).toHaveBeenCalledTimes(2);
            done();
        });
    });
});