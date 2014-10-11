'use strict';

exports.init = function (req, res) {
    if (req.user) {
        if (req.param('game_id') !== '-1') {
            res.render('games/play/zertz/index',
                { game_id: req.param('game_id'),
                    owner_id: req.param('owner_id'),
                    opponent_id: req.param('opponent_id'),
                    mode: req.param('mode') === 'regular' ? 0 : 1,
                    color: req.param('color') === 'one' ? 0 : 1,
                    opponent_color: req.param('color') === 'one' ? 1 : 0
                });
        } else {
            res.render('games/play/zertz/index',
                { game_id: -1,
                    owner_id: -1,
                    opponent_id: -1,
                    color: req.param('color') === 'one' ? 0 : 1,
                    mode: req.param('mode') === 'regular' ? 0 : 1,
                    game_type: req.param('game_type'),
                    opponent_color: req.param('color') === 'one' ? 1 : 0
                });
        }
    } else {
        res.redirect('/');
    }
};