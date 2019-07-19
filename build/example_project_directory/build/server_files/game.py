import sqltasks

class Game:
	def __init__(self, players, game_mode_id, topic_id):
		"""
		game object which holds the logic for each game
		has a list of players in the game which it shares game data with
		such as the round_number, current_question, and opponent scores
		"""
		self.players = players
		self.game_mode = sqltasks.get_game_mode_by_id(game_mode_id)

		self.topic_id = topic_id
		self.max_rounds = self.game_mode["number_questions"]
		self.time_to_answer = self.game_mode["time"]
		self.current_round = -1
		self.players_answered = []

		self.questions = sqltasks.get_questions_by_topic(topic_id, self.max_rounds)
		self.current_question = False
		self.is_running = True

		self.next_round()

	def next_round(self):
		"""
		increments the round_number,
		checks if we have run out of questions, if so call game_over,
		if not send the next question to the client
		"""

		self.current_round += 1

		if self.current_round == self.max_rounds:
			self.game_over()
			return None

		self.current_question = self.questions[self.current_round]
		self.send_next_question()

	def game_over(self):
		"""
		when game finishes, update who won the game, then let the players
		know that the game is over
		"""

		self.check_winners()
		self.is_running = False

		# send clients their scores
		for player in self.players:
			player.end_game()

	def check_winners(self):
		"""
		finds the winner of the current game, and sets it via the player.outcome
		attribute
		"""
		highest = -1
		winner = False
		players_drawn = []

		for player in self.players:

			if (player.get_score() > highest):
				winner = player
				highest = player.get_score()
				players_drawn = [player]
			elif (player.get_score() == highest):
				players_drawn.append(player)


		if len(players_drawn) > 1:
			for player in players_drawn:
					player.set_game_outcome("Draw")
		else:
			winner.set_game_outcome("Winner")

	def player_disconnect(self, disconnected_player):
		"""
		removes the disconnected_player from the list of players,
		then notifies the other players that they have disconnected
		"""
		players = self.players
		for player in players:
			if (player != disconnected_player):
				player.send_to_self("", "player_disconnect")

	def send_next_question(self):
		"""
		sends the next question in the list to the players in the session
		"""

		players = self.players


		question = self.current_question["question"]
		answers = sqltasks.get_answers_by_question_id(self.current_question["id"])
		time_to_answer = self.time_to_answer
		round_number = self.current_round + 1
		max_rounds = self.max_rounds

		for player in players:
			player.update_question(question, answers, time_to_answer,
				round_number, max_rounds)


	def player_answered(self, player, answer_id, time_answered):
		"""
		every time a player answers a question, this function gets called
		"""

		if player in self.players_answered:
			return None

		self.players_answered.append(player)
		is_correct = sqltasks.is_answer_correct(answer_id)

		if is_correct:
			player.update_score(player.get_score() + int(time_answered) * 10 + 10)
			player.send_to_self("", "correct_answer")
		else:
			player.send_to_self("", "incorrect_answer")

		self.update_scores()

		if len(self.players) == len(self.players_answered):
			self.players_answered = []
			self.next_round()

	def update_scores(self):
		"""
		let players in game know when an opponent has answered
		"""
		scores = []
		for player in self.players:
			scores.append(player.get_score())

		for player in self.players:
			player.update_opponent_scores(scores)






