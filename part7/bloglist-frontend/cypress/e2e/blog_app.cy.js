describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset');

    // create a user to backend
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen',
    };
    cy.request('POST', 'http://localhost:3003/api/users/', user);

    cy.visit('http://localhost:3000');
  });

  it('Login form is shown', function () {
    cy.contains('log in to application');
  });

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.contains('login').click();
      cy.get('#username').type('mluukkai');
      cy.get('#password').type('salainen');
      cy.get('#login-button').click();

      cy.contains('Matti Luukkainen logged in');
    });

    it('fails with wrong credentials', function () {
      cy.contains('login').click();
      cy.get('#username').type('mluukkai');
      cy.get('#password').type('wrong');
      cy.get('#login-button').click();

      cy.get('.notification')
        .should('contain', 'invalid username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid');

      cy.get('html').should('not.contain', 'Matti Luukkainen logged in');
    });
  });

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'mluukkai', password: 'salainen' });
    });

    it('A blog can be created', function () {
      cy.contains('create new blog').click();

      cy.get('#input-title').type('TestTitle');
      cy.get('#input-author').type('TestAuthor');
      cy.get('#input-url').type('http://www.testurl.de');

      cy.get('.submit-button').click();

      cy.get('.notification')
        .should('contain', 'A new blog TestTitle by TestAuthor added')
        .and('have.css', 'color', 'rgb(0, 128, 0)')
        .and('have.css', 'border-style', 'solid');

      cy.contains('TestTitle TestAuthor');
    });

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'TestTitle',
          author: 'TestAuthor',
          url: 'http://www.testurl.de',
        });
      });

      it('blog can be liked by user', function () {
        cy.contains('TestTitle TestAuthor');
        cy.contains('view').click();
        cy.contains('like').click();

        cy.get('.notification')
          .should('contain', 'Blog TestTitle was updated on server')
          .and('have.css', 'color', 'rgb(0, 128, 0)')
          .and('have.css', 'border-style', 'solid');

        cy.contains('likes 1');
      });

      it('blog can be delete by user', function () {
        cy.contains('TestTitle TestAuthor');
        cy.contains('view').click();
        cy.contains('remove').click();

        cy.get('.notification')
          .should('contain', 'blog TestTitle by TestAuthor was deleted!')
          .and('have.css', 'color', 'rgb(0, 128, 0)')
          .and('have.css', 'border-style', 'solid');

        cy.get('html').should('not.contain', 'TestTitle TestAuthor');
      });

      it('blog can not be delete by other user', function () {
        const user = { username: 'testuser', name: 'test', password: 'test' };
        cy.request('POST', 'http://localhost:3003/api/users/', user);
        cy.login(user);

        cy.contains('test logged in');

        cy.contains('TestTitle TestAuthor');
        cy.contains('view').click();

        cy.contains('TestTitle TestAuthor').should('not.contain', 'remove');
      });
    });

    describe('and several blogs exist', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'The title with the second most likes',
          author: 'second most',
          url: 'http://second.most',
        });
        cy.createBlog({
          title: 'The title with the most likes',
          author: 'most',
          url: 'http://most',
        });
      });

      it('blogs are ordered according to the most likes being first', function () {
        cy.contains('The title with the most likes').find('button').as('viewButton');

        cy.get('@viewButton').click();
        cy.get('@viewButton').parent().contains('like').click();
        cy.wait(500);
        cy.get('@viewButton').parent().contains('like').click();

        cy.contains('The title with the second most likes').find('button').as('viewButton');

        cy.get('@viewButton').click();
        cy.get('@viewButton').parent().contains('like').click();

        cy.get('.blog').eq(0).should('contain', 'The title with the most likes');
        cy.get('.blog').eq(1).should('contain', 'The title with the second most likes');
      });
    });
  });
});
