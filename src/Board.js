// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      // console.log(rowIndex)
      var row = this.attributes[rowIndex];
      var counter = 0;
      for (var x = 0; x < row.length; x++) {
        if (row[x] !== 0) {
          counter++;
        }
      }
      if (counter > 1) {
        return true;
      }
      return false; // fixme
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      var rows = this.rows();
      console.log(this);
      // console.log('rows:', rows);
      for (var x = 0; x < rows.length; x++) {
        var row = rows[x];
        // console.log('row ', x + ':', row);
        if (this.hasRowConflictAt(x)) {
          return true;
        }
      }
      return false; // fixme
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var rows = this.rows();
      var column = [];
      for (var x = 0; x < rows.length; x++) { // column maker loop
        var row = rows[x]; // set row equal to rows at x
        column.push(row[colIndex]); // push rows at x to the column
      }
      var counter = 0;
      for (var x = 0; x < column.length; x++) {
        if (column[x] !== 0) {
          counter++;
        }
      }
      if (counter > 1) {
        return true;
      }
      return false; // fixme
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var rows = this.rows();
      for (var x = 0; x < rows.length; x++) {
        var colIndex = x;
        var row = rows[x];
        if (this.hasColConflictAt(x)) {
          return true;
        }
      }
      return false; // fixme
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var rows = this.rows();
      var rowsCopy = rows.slice();
      // console.log(rows);
      var counter = 0;
      var search = majorDiagonalColumnIndexAtFirstRow;
      // define the search index because it's easier to read
      // console.log('major index:', majorDiagonalColumnIndexAtFirstRow);
      // for every whole number that major is below zero by, we need to increment rows by that many
      if (majorDiagonalColumnIndexAtFirstRow === -1) { // if it's invalid by 1
        search = 0;
        rows = rows.splice(1, rows.length);
      } else if (majorDiagonalColumnIndexAtFirstRow === -2) {
        search = 0;
        rows = rows.splice(2, rows.length);
      } else if (majorDiagonalColumnIndexAtFirstRow === 1) {
        search = 1;
        rows = rows.splice(0, rows.length);
        // console.log(rows);
      }


      for (var x = 0; x < rows.length; x++) { // loop through rows
        var row = rows[x];
        if (row[search] === 1) { // if row at search index = 1
          counter ++; // increment the counter
        }
        search++; // increment search index each iteration to check down 1 & right 1
      }
      if (counter > 1) { // if counter is greater than 1
        return true; // there is a conflict
      }
      return false; // fixme
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var rows = this.rows();
      console.log(this.get('n'));
      for (var x = -2; x < rows.length; x++) {
        var index = x;
        var row = rows[index];
        if (this.hasMajorDiagonalConflictAt(index)) {
          return true;
        }
      }
      console.log('end');
      return false; // fixme
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var rows = this.rows();
      var search = minorDiagonalColumnIndexAtFirstRow;
      // console.log(search);
      console.log(this.get('n'));
      var counter = 0;

      if (minorDiagonalColumnIndexAtFirstRow === 4) { // if it's invalid by 1
        search = 3;
        rows = rows.splice(1, rows.length);
      } else if (minorDiagonalColumnIndexAtFirstRow === 5) {
        search = 3;
        rows = rows.splice(2, rows.length);
      }

      for (var x = 0; x < rows.length; x++) { // loop through rows
        var row = rows[x];
        if (row[search] === 1) { // if row at search index = 1
          counter ++; // increment the counter
        }
        search--; // increment search index each iteration to check down 1 & right 1
      }
      if (counter > 1) { // if counter is greater than 1
        return true; // there is a conflict
      }

      return false; // fixme
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var rows = this.rows();
      console.log(this.get('n'));
      for (var x = 0; x < rows.length + 2; x++) {
        var index = x;
        if (this.hasMinorDiagonalConflictAt(index)) {
          return true;
        }
      }
      console.log('end');
      return false; // fixme
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
