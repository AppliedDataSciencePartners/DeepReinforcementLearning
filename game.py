import numpy as np
import logging

class Game:

    def __init__(self):		
        self.currentPlayer = 1
        self.gameState = GameState(np.array([
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		]], dtype=np.int), 1)
		self.actionSpace = np.array([
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		], dtype=np.int)
        self.pieces = {'1':'X', '0': '-', '-1':'O'}
        self.grid_shape = (15,15)
        self.input_shape = (2,15,15)
        self.name = 'gomoku'
        self.state_size = len(self.gameState.binary)
        self.action_size = len(self.actionSpace)

    def reset(self):
        self.gameState = GameState(np.array([
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		], dtype=np.int), 1)
		self.currentPlayer = 1
		return self.gameState

	def step(self, action):
		next_state, value, done = self.gameState.takeAction(action)
		self.gameState = next_state
		self.currentPlayer = -self.currentPlayer
		info = None
		return ((next_state, value, done, info))

	def identities(self, state, actionValues):
		identities = [(state,actionValues)]

		currentBoard = state.board
		currentAV = actionValues

		currentBoard = np.array([
			currentBoard[0], currentBoard[1], currentBoard[2], currentBoard[3], currentBoard[4], currentBoard[5], currentBoard[6], currentBoard[7], currentBoard[8], currentBoard[9], currentBoard[10], currentBoard[11], currentBoard[12], currentBoard[13], currentBoard[14],  
			currentBoard[15], currentBoard[16], currentBoard[17], currentBoard[18], currentBoard[19], currentBoard[20], currentBoard[21], currentBoard[22], currentBoard[23], currentBoard[24], currentBoard[25], currentBoard[26], currentBoard[27], currentBoard[28], currentBoard[29],  
			currentBoard[30], currentBoard[31], currentBoard[32], currentBoard[33], currentBoard[34], currentBoard[35], currentBoard[36], currentBoard[37], currentBoard[38], currentBoard[39], currentBoard[40], currentBoard[41], currentBoard[42], currentBoard[43], currentBoard[44],  
			currentBoard[45], currentBoard[46], currentBoard[47], currentBoard[48], currentBoard[49], currentBoard[50], currentBoard[51], currentBoard[52], currentBoard[53], currentBoard[54], currentBoard[55], currentBoard[56], currentBoard[57], currentBoard[58], currentBoard[59],  
			currentBoard[60], currentBoard[61], currentBoard[62], currentBoard[63], currentBoard[64], currentBoard[65], currentBoard[66], currentBoard[67], currentBoard[68], currentBoard[69], currentBoard[70], currentBoard[71], currentBoard[72], currentBoard[73], currentBoard[74],  
			currentBoard[75], currentBoard[76], currentBoard[77], currentBoard[78], currentBoard[79], currentBoard[80], currentBoard[81], currentBoard[82], currentBoard[83], currentBoard[84], currentBoard[85], currentBoard[86], currentBoard[87], currentBoard[88], currentBoard[89],  
			currentBoard[90], currentBoard[91], currentBoard[92], currentBoard[93], currentBoard[94], currentBoard[95], currentBoard[96], currentBoard[97], currentBoard[98], currentBoard[99], currentBoard[100], currentBoard[101], currentBoard[102], currentBoard[103], currentBoard[104],  
			currentBoard[105], currentBoard[106], currentBoard[107], currentBoard[108], currentBoard[109], currentBoard[110], currentBoard[111], currentBoard[112], currentBoard[113], currentBoard[114], currentBoard[115], currentBoard[116], currentBoard[117], currentBoard[118], currentBoard[119],  
			currentBoard[120], currentBoard[121], currentBoard[122], currentBoard[123], currentBoard[124], currentBoard[125], currentBoard[126], currentBoard[127], currentBoard[128], currentBoard[129], currentBoard[130], currentBoard[131], currentBoard[132], currentBoard[133], currentBoard[134],  
			currentBoard[135], currentBoard[136], currentBoard[137], currentBoard[138], currentBoard[139], currentBoard[140], currentBoard[141], currentBoard[142], currentBoard[143], currentBoard[144], currentBoard[145], currentBoard[146], currentBoard[147], currentBoard[148], currentBoard[149],  
			currentBoard[150], currentBoard[151], currentBoard[152], currentBoard[153], currentBoard[154], currentBoard[155], currentBoard[156], currentBoard[157], currentBoard[158], currentBoard[159], currentBoard[160], currentBoard[161], currentBoard[162], currentBoard[163], currentBoard[164],  
			currentBoard[165], currentBoard[166], currentBoard[167], currentBoard[168], currentBoard[169], currentBoard[170], currentBoard[171], currentBoard[172], currentBoard[173], currentBoard[174], currentBoard[175], currentBoard[176], currentBoard[177], currentBoard[178], currentBoard[179],  
			currentBoard[180], currentBoard[181], currentBoard[182], currentBoard[183], currentBoard[184], currentBoard[185], currentBoard[186], currentBoard[187], currentBoard[188], currentBoard[189], currentBoard[190], currentBoard[191], currentBoard[192], currentBoard[193], currentBoard[194],  
			currentBoard[195], currentBoard[196], currentBoard[197], currentBoard[198], currentBoard[199], currentBoard[200], currentBoard[201], currentBoard[202], currentBoard[203], currentBoard[204], currentBoard[205], currentBoard[206], currentBoard[207], currentBoard[208], currentBoard[209],  
			currentBoard[210], currentBoard[211], currentBoard[212], currentBoard[213], currentBoard[214], currentBoard[215], currentBoard[216], currentBoard[217], currentBoard[218], currentBoard[219], currentBoard[220], currentBoard[221], currentBoard[222], currentBoard[223], currentBoard[224]
			])

		currentAV = np.array([
			currentBoard[0], currentBoard[1], currentBoard[2], currentBoard[3], currentBoard[4], currentBoard[5], currentBoard[6], currentBoard[7], currentBoard[8], currentBoard[9], currentBoard[10], currentBoard[11], currentBoard[12], currentBoard[13], currentBoard[14],  
			currentBoard[15], currentBoard[16], currentBoard[17], currentBoard[18], currentBoard[19], currentBoard[20], currentBoard[21], currentBoard[22], currentBoard[23], currentBoard[24], currentBoard[25], currentBoard[26], currentBoard[27], currentBoard[28], currentBoard[29],  
			currentBoard[30], currentBoard[31], currentBoard[32], currentBoard[33], currentBoard[34], currentBoard[35], currentBoard[36], currentBoard[37], currentBoard[38], currentBoard[39], currentBoard[40], currentBoard[41], currentBoard[42], currentBoard[43], currentBoard[44],  
			currentBoard[45], currentBoard[46], currentBoard[47], currentBoard[48], currentBoard[49], currentBoard[50], currentBoard[51], currentBoard[52], currentBoard[53], currentBoard[54], currentBoard[55], currentBoard[56], currentBoard[57], currentBoard[58], currentBoard[59],  
			currentBoard[60], currentBoard[61], currentBoard[62], currentBoard[63], currentBoard[64], currentBoard[65], currentBoard[66], currentBoard[67], currentBoard[68], currentBoard[69], currentBoard[70], currentBoard[71], currentBoard[72], currentBoard[73], currentBoard[74],  
			currentBoard[75], currentBoard[76], currentBoard[77], currentBoard[78], currentBoard[79], currentBoard[80], currentBoard[81], currentBoard[82], currentBoard[83], currentBoard[84], currentBoard[85], currentBoard[86], currentBoard[87], currentBoard[88], currentBoard[89],  
			currentBoard[90], currentBoard[91], currentBoard[92], currentBoard[93], currentBoard[94], currentBoard[95], currentBoard[96], currentBoard[97], currentBoard[98], currentBoard[99], currentBoard[100], currentBoard[101], currentBoard[102], currentBoard[103], currentBoard[104],  
			currentBoard[105], currentBoard[106], currentBoard[107], currentBoard[108], currentBoard[109], currentBoard[110], currentBoard[111], currentBoard[112], currentBoard[113], currentBoard[114], currentBoard[115], currentBoard[116], currentBoard[117], currentBoard[118], currentBoard[119],  
			currentBoard[120], currentBoard[121], currentBoard[122], currentBoard[123], currentBoard[124], currentBoard[125], currentBoard[126], currentBoard[127], currentBoard[128], currentBoard[129], currentBoard[130], currentBoard[131], currentBoard[132], currentBoard[133], currentBoard[134],  
			currentBoard[135], currentBoard[136], currentBoard[137], currentBoard[138], currentBoard[139], currentBoard[140], currentBoard[141], currentBoard[142], currentBoard[143], currentBoard[144], currentBoard[145], currentBoard[146], currentBoard[147], currentBoard[148], currentBoard[149],  
			currentBoard[150], currentBoard[151], currentBoard[152], currentBoard[153], currentBoard[154], currentBoard[155], currentBoard[156], currentBoard[157], currentBoard[158], currentBoard[159], currentBoard[160], currentBoard[161], currentBoard[162], currentBoard[163], currentBoard[164],  
			currentBoard[165], currentBoard[166], currentBoard[167], currentBoard[168], currentBoard[169], currentBoard[170], currentBoard[171], currentBoard[172], currentBoard[173], currentBoard[174], currentBoard[175], currentBoard[176], currentBoard[177], currentBoard[178], currentBoard[179],  
			currentBoard[180], currentBoard[181], currentBoard[182], currentBoard[183], currentBoard[184], currentBoard[185], currentBoard[186], currentBoard[187], currentBoard[188], currentBoard[189], currentBoard[190], currentBoard[191], currentBoard[192], currentBoard[193], currentBoard[194],  
			currentBoard[195], currentBoard[196], currentBoard[197], currentBoard[198], currentBoard[199], currentBoard[200], currentBoard[201], currentBoard[202], currentBoard[203], currentBoard[204], currentBoard[205], currentBoard[206], currentBoard[207], currentBoard[208], currentBoard[209],  
			currentBoard[210], currentBoard[211], currentBoard[212], currentBoard[213], currentBoard[214], currentBoard[215], currentBoard[216], currentBoard[217], currentBoard[218], currentBoard[219], currentBoard[220], currentBoard[221], currentBoard[222], currentBoard[223], currentBoard[224]
					])

		identities.append((GameState(currentBoard, state.playerTurn), currentAV))

		return identities


class GameState():
	def __init__(self, board, playerTurn):
		self.board = board
		self.pieces = {'1':'X', '0': '-', '-1':'O'}
		self.winners = [
# --------Horiz: 165 --------------
 [0, 1, 2, 3, 4], [1, 2, 3, 4, 5], [2, 3, 4, 5, 6], [3, 4, 5, 6, 7], [4, 5, 6, 7, 8], [5, 6, 7, 8, 9], [6, 7, 8, 9, 10], [7, 8, 9, 10, 11], [8, 9, 10, 11, 12], [9, 10, 11, 12, 13], [10, 11, 12, 13, 14],  
 [15, 16, 17, 18, 19], [16, 17, 18, 19, 20], [17, 18, 19, 20, 21], [18, 19, 20, 21, 22], [19, 20, 21, 22, 23], [20, 21, 22, 23, 24], [21, 22, 23, 24, 25], [22, 23, 24, 25, 26], [23, 24, 25, 26, 27], [24, 25, 26, 27, 28], [25, 26, 27, 28, 29],  
 [30, 31, 32, 33, 34], [31, 32, 33, 34, 35], [32, 33, 34, 35, 36], [33, 34, 35, 36, 37], [34, 35, 36, 37, 38], [35, 36, 37, 38, 39], [36, 37, 38, 39, 40], [37, 38, 39, 40, 41], [38, 39, 40, 41, 42], [39, 40, 41, 42, 43], [40, 41, 42, 43, 44],  
 [45, 46, 47, 48, 49], [46, 47, 48, 49, 50], [47, 48, 49, 50, 51], [48, 49, 50, 51, 52], [49, 50, 51, 52, 53], [50, 51, 52, 53, 54], [51, 52, 53, 54, 55], [52, 53, 54, 55, 56], [53, 54, 55, 56, 57], [54, 55, 56, 57, 58], [55, 56, 57, 58, 59],  
 [60, 61, 62, 63, 64], [61, 62, 63, 64, 65], [62, 63, 64, 65, 66], [63, 64, 65, 66, 67], [64, 65, 66, 67, 68], [65, 66, 67, 68, 69], [66, 67, 68, 69, 70], [67, 68, 69, 70, 71], [68, 69, 70, 71, 72], [69, 70, 71, 72, 73], [70, 71, 72, 73, 74],  
 [75, 76, 77, 78, 79], [76, 77, 78, 79, 80], [77, 78, 79, 80, 81], [78, 79, 80, 81, 82], [79, 80, 81, 82, 83], [80, 81, 82, 83, 84], [81, 82, 83, 84, 85], [82, 83, 84, 85, 86], [83, 84, 85, 86, 87], [84, 85, 86, 87, 88], [85, 86, 87, 88, 89],  
 [90, 91, 92, 93, 94], [91, 92, 93, 94, 95], [92, 93, 94, 95, 96], [93, 94, 95, 96, 97], [94, 95, 96, 97, 98], [95, 96, 97, 98, 99], [96, 97, 98, 99, 100], [97, 98, 99, 100, 101], [98, 99, 100, 101, 102], [99, 100, 101, 102, 103], [100, 101, 102, 103, 104],  
 [105, 106, 107, 108, 109], [106, 107, 108, 109, 110], [107, 108, 109, 110, 111], [108, 109, 110, 111, 112], [109, 110, 111, 112, 113], [110, 111, 112, 113, 114], [111, 112, 113, 114, 115], [112, 113, 114, 115, 116], [113, 114, 115, 116, 117], [114, 115, 116, 117, 118], [115, 116, 117, 118, 119],  
 [120, 121, 122, 123, 124], [121, 122, 123, 124, 125], [122, 123, 124, 125, 126], [123, 124, 125, 126, 127], [124, 125, 126, 127, 128], [125, 126, 127, 128, 129], [126, 127, 128, 129, 130], [127, 128, 129, 130, 131], [128, 129, 130, 131, 132], [129, 130, 131, 132, 133], [130, 131, 132, 133, 134],  
 [135, 136, 137, 138, 139], [136, 137, 138, 139, 140], [137, 138, 139, 140, 141], [138, 139, 140, 141, 142], [139, 140, 141, 142, 143], [140, 141, 142, 143, 144], [141, 142, 143, 144, 145], [142, 143, 144, 145, 146], [143, 144, 145, 146, 147], [144, 145, 146, 147, 148], [145, 146, 147, 148, 149],  
 [150, 151, 152, 153, 154], [151, 152, 153, 154, 155], [152, 153, 154, 155, 156], [153, 154, 155, 156, 157], [154, 155, 156, 157, 158], [155, 156, 157, 158, 159], [156, 157, 158, 159, 160], [157, 158, 159, 160, 161], [158, 159, 160, 161, 162], [159, 160, 161, 162, 163], [160, 161, 162, 163, 164],  
 [165, 166, 167, 168, 169], [166, 167, 168, 169, 170], [167, 168, 169, 170, 171], [168, 169, 170, 171, 172], [169, 170, 171, 172, 173], [170, 171, 172, 173, 174], [171, 172, 173, 174, 175], [172, 173, 174, 175, 176], [173, 174, 175, 176, 177], [174, 175, 176, 177, 178], [175, 176, 177, 178, 179],  
 [180, 181, 182, 183, 184], [181, 182, 183, 184, 185], [182, 183, 184, 185, 186], [183, 184, 185, 186, 187], [184, 185, 186, 187, 188], [185, 186, 187, 188, 189], [186, 187, 188, 189, 190], [187, 188, 189, 190, 191], [188, 189, 190, 191, 192], [189, 190, 191, 192, 193], [190, 191, 192, 193, 194],  
 [195, 196, 197, 198, 199], [196, 197, 198, 199, 200], [197, 198, 199, 200, 201], [198, 199, 200, 201, 202], [199, 200, 201, 202, 203], [200, 201, 202, 203, 204], [201, 202, 203, 204, 205], [202, 203, 204, 205, 206], [203, 204, 205, 206, 207], [204, 205, 206, 207, 208], [205, 206, 207, 208, 209],  
 [210, 211, 212, 213, 214], [211, 212, 213, 214, 215], [212, 213, 214, 215, 216], [213, 214, 215, 216, 217], [214, 215, 216, 217, 218], [215, 216, 217, 218, 219], [216, 217, 218, 219, 220], [217, 218, 219, 220, 221], [218, 219, 220, 221, 222], [219, 220, 221, 222, 223], [220, 221, 222, 223, 224],  
# --------Vert: 165 --------------
 [0, 15, 30, 45, 60], [1, 16, 31, 46, 61], [2, 17, 32, 47, 62], [3, 18, 33, 48, 63], [4, 19, 34, 49, 64], [5, 20, 35, 50, 65], [6, 21, 36, 51, 66], [7, 22, 37, 52, 67], [8, 23, 38, 53, 68], [9, 24, 39, 54, 69], [10, 25, 40, 55, 70], [11, 26, 41, 56, 71], [12, 27, 42, 57, 72], [13, 28, 43, 58, 73], [14, 29, 44, 59, 74],  
 [15, 30, 45, 60, 75], [16, 31, 46, 61, 76], [17, 32, 47, 62, 77], [18, 33, 48, 63, 78], [19, 34, 49, 64, 79], [20, 35, 50, 65, 80], [21, 36, 51, 66, 81], [22, 37, 52, 67, 82], [23, 38, 53, 68, 83], [24, 39, 54, 69, 84], [25, 40, 55, 70, 85], [26, 41, 56, 71, 86], [27, 42, 57, 72, 87], [28, 43, 58, 73, 88], [29, 44, 59, 74, 89],  
 [30, 45, 60, 75, 90], [31, 46, 61, 76, 91], [32, 47, 62, 77, 92], [33, 48, 63, 78, 93], [34, 49, 64, 79, 94], [35, 50, 65, 80, 95], [36, 51, 66, 81, 96], [37, 52, 67, 82, 97], [38, 53, 68, 83, 98], [39, 54, 69, 84, 99], [40, 55, 70, 85, 100], [41, 56, 71, 86, 101], [42, 57, 72, 87, 102], [43, 58, 73, 88, 103], [44, 59, 74, 89, 104],  
 [45, 60, 75, 90, 105], [46, 61, 76, 91, 106], [47, 62, 77, 92, 107], [48, 63, 78, 93, 108], [49, 64, 79, 94, 109], [50, 65, 80, 95, 110], [51, 66, 81, 96, 111], [52, 67, 82, 97, 112], [53, 68, 83, 98, 113], [54, 69, 84, 99, 114], [55, 70, 85, 100, 115], [56, 71, 86, 101, 116], [57, 72, 87, 102, 117], [58, 73, 88, 103, 118], [59, 74, 89, 104, 119],  
 [60, 75, 90, 105, 120], [61, 76, 91, 106, 121], [62, 77, 92, 107, 122], [63, 78, 93, 108, 123], [64, 79, 94, 109, 124], [65, 80, 95, 110, 125], [66, 81, 96, 111, 126], [67, 82, 97, 112, 127], [68, 83, 98, 113, 128], [69, 84, 99, 114, 129], [70, 85, 100, 115, 130], [71, 86, 101, 116, 131], [72, 87, 102, 117, 132], [73, 88, 103, 118, 133], [74, 89, 104, 119, 134],  
 [75, 90, 105, 120, 135], [76, 91, 106, 121, 136], [77, 92, 107, 122, 137], [78, 93, 108, 123, 138], [79, 94, 109, 124, 139], [80, 95, 110, 125, 140], [81, 96, 111, 126, 141], [82, 97, 112, 127, 142], [83, 98, 113, 128, 143], [84, 99, 114, 129, 144], [85, 100, 115, 130, 145], [86, 101, 116, 131, 146], [87, 102, 117, 132, 147], [88, 103, 118, 133, 148], [89, 104, 119, 134, 149],  
 [90, 105, 120, 135, 150], [91, 106, 121, 136, 151], [92, 107, 122, 137, 152], [93, 108, 123, 138, 153], [94, 109, 124, 139, 154], [95, 110, 125, 140, 155], [96, 111, 126, 141, 156], [97, 112, 127, 142, 157], [98, 113, 128, 143, 158], [99, 114, 129, 144, 159], [100, 115, 130, 145, 160], [101, 116, 131, 146, 161], [102, 117, 132, 147, 162], [103, 118, 133, 148, 163], [104, 119, 134, 149, 164],  
 [105, 120, 135, 150, 165], [106, 121, 136, 151, 166], [107, 122, 137, 152, 167], [108, 123, 138, 153, 168], [109, 124, 139, 154, 169], [110, 125, 140, 155, 170], [111, 126, 141, 156, 171], [112, 127, 142, 157, 172], [113, 128, 143, 158, 173], [114, 129, 144, 159, 174], [115, 130, 145, 160, 175], [116, 131, 146, 161, 176], [117, 132, 147, 162, 177], [118, 133, 148, 163, 178], [119, 134, 149, 164, 179],  
 [120, 135, 150, 165, 180], [121, 136, 151, 166, 181], [122, 137, 152, 167, 182], [123, 138, 153, 168, 183], [124, 139, 154, 169, 184], [125, 140, 155, 170, 185], [126, 141, 156, 171, 186], [127, 142, 157, 172, 187], [128, 143, 158, 173, 188], [129, 144, 159, 174, 189], [130, 145, 160, 175, 190], [131, 146, 161, 176, 191], [132, 147, 162, 177, 192], [133, 148, 163, 178, 193], [134, 149, 164, 179, 194],  
 [135, 150, 165, 180, 195], [136, 151, 166, 181, 196], [137, 152, 167, 182, 197], [138, 153, 168, 183, 198], [139, 154, 169, 184, 199], [140, 155, 170, 185, 200], [141, 156, 171, 186, 201], [142, 157, 172, 187, 202], [143, 158, 173, 188, 203], [144, 159, 174, 189, 204], [145, 160, 175, 190, 205], [146, 161, 176, 191, 206], [147, 162, 177, 192, 207], [148, 163, 178, 193, 208], [149, 164, 179, 194, 209],  
 [150, 165, 180, 195, 210], [151, 166, 181, 196, 211], [152, 167, 182, 197, 212], [153, 168, 183, 198, 213], [154, 169, 184, 199, 214], [155, 170, 185, 200, 215], [156, 171, 186, 201, 216], [157, 172, 187, 202, 217], [158, 173, 188, 203, 218], [159, 174, 189, 204, 219], [160, 175, 190, 205, 220], [161, 176, 191, 206, 221], [162, 177, 192, 207, 222], [163, 178, 193, 208, 223], [164, 179, 194, 209, 224],  
# --------Diag_Down 121 --------------
 [0, 16, 32, 48, 64], [1, 17, 33, 49, 65], [2, 18, 34, 50, 66], [3, 19, 35, 51, 67], [4, 20, 36, 52, 68], [5, 21, 37, 53, 69], [6, 22, 38, 54, 70], [7, 23, 39, 55, 71], [8, 24, 40, 56, 72], [9, 25, 41, 57, 73], [10, 26, 42, 58, 74],  
 [15, 31, 47, 63, 79], [16, 32, 48, 64, 80], [17, 33, 49, 65, 81], [18, 34, 50, 66, 82], [19, 35, 51, 67, 83], [20, 36, 52, 68, 84], [21, 37, 53, 69, 85], [22, 38, 54, 70, 86], [23, 39, 55, 71, 87], [24, 40, 56, 72, 88], [25, 41, 57, 73, 89],  
 [30, 46, 62, 78, 94], [31, 47, 63, 79, 95], [32, 48, 64, 80, 96], [33, 49, 65, 81, 97], [34, 50, 66, 82, 98], [35, 51, 67, 83, 99], [36, 52, 68, 84, 100], [37, 53, 69, 85, 101], [38, 54, 70, 86, 102], [39, 55, 71, 87, 103], [40, 56, 72, 88, 104],  
 [45, 61, 77, 93, 109], [46, 62, 78, 94, 110], [47, 63, 79, 95, 111], [48, 64, 80, 96, 112], [49, 65, 81, 97, 113], [50, 66, 82, 98, 114], [51, 67, 83, 99, 115], [52, 68, 84, 100, 116], [53, 69, 85, 101, 117], [54, 70, 86, 102, 118], [55, 71, 87, 103, 119],  
 [60, 76, 92, 108, 124], [61, 77, 93, 109, 125], [62, 78, 94, 110, 126], [63, 79, 95, 111, 127], [64, 80, 96, 112, 128], [65, 81, 97, 113, 129], [66, 82, 98, 114, 130], [67, 83, 99, 115, 131], [68, 84, 100, 116, 132], [69, 85, 101, 117, 133], [70, 86, 102, 118, 134],  
 [75, 91, 107, 123, 139], [76, 92, 108, 124, 140], [77, 93, 109, 125, 141], [78, 94, 110, 126, 142], [79, 95, 111, 127, 143], [80, 96, 112, 128, 144], [81, 97, 113, 129, 145], [82, 98, 114, 130, 146], [83, 99, 115, 131, 147], [84, 100, 116, 132, 148], [85, 101, 117, 133, 149],  
 [90, 106, 122, 138, 154], [91, 107, 123, 139, 155], [92, 108, 124, 140, 156], [93, 109, 125, 141, 157], [94, 110, 126, 142, 158], [95, 111, 127, 143, 159], [96, 112, 128, 144, 160], [97, 113, 129, 145, 161], [98, 114, 130, 146, 162], [99, 115, 131, 147, 163], [100, 116, 132, 148, 164],  
 [105, 121, 137, 153, 169], [106, 122, 138, 154, 170], [107, 123, 139, 155, 171], [108, 124, 140, 156, 172], [109, 125, 141, 157, 173], [110, 126, 142, 158, 174], [111, 127, 143, 159, 175], [112, 128, 144, 160, 176], [113, 129, 145, 161, 177], [114, 130, 146, 162, 178], [115, 131, 147, 163, 179],  
 [120, 136, 152, 168, 184], [121, 137, 153, 169, 185], [122, 138, 154, 170, 186], [123, 139, 155, 171, 187], [124, 140, 156, 172, 188], [125, 141, 157, 173, 189], [126, 142, 158, 174, 190], [127, 143, 159, 175, 191], [128, 144, 160, 176, 192], [129, 145, 161, 177, 193], [130, 146, 162, 178, 194],  
 [135, 151, 167, 183, 199], [136, 152, 168, 184, 200], [137, 153, 169, 185, 201], [138, 154, 170, 186, 202], [139, 155, 171, 187, 203], [140, 156, 172, 188, 204], [141, 157, 173, 189, 205], [142, 158, 174, 190, 206], [143, 159, 175, 191, 207], [144, 160, 176, 192, 208], [145, 161, 177, 193, 209],  
 [150, 166, 182, 198, 214], [151, 167, 183, 199, 215], [152, 168, 184, 200, 216], [153, 169, 185, 201, 217], [154, 170, 186, 202, 218], [155, 171, 187, 203, 219], [156, 172, 188, 204, 220], [157, 173, 189, 205, 221], [158, 174, 190, 206, 222], [159, 175, 191, 207, 223], [160, 176, 192, 208, 224],  
# --------Diag_Back 121 --------------
 [4, 18, 32, 46, 60], [5, 19, 33, 47, 61], [6, 20, 34, 48, 62], [7, 21, 35, 49, 63], [8, 22, 36, 50, 64], [9, 23, 37, 51, 65], [10, 24, 38, 52, 66], [11, 25, 39, 53, 67], [12, 26, 40, 54, 68], [13, 27, 41, 55, 69], [14, 28, 42, 56, 70],  
 [19, 33, 47, 61, 75], [20, 34, 48, 62, 76], [21, 35, 49, 63, 77], [22, 36, 50, 64, 78], [23, 37, 51, 65, 79], [24, 38, 52, 66, 80], [25, 39, 53, 67, 81], [26, 40, 54, 68, 82], [27, 41, 55, 69, 83], [28, 42, 56, 70, 84], [29, 43, 57, 71, 85],  
 [34, 48, 62, 76, 90], [35, 49, 63, 77, 91], [36, 50, 64, 78, 92], [37, 51, 65, 79, 93], [38, 52, 66, 80, 94], [39, 53, 67, 81, 95], [40, 54, 68, 82, 96], [41, 55, 69, 83, 97], [42, 56, 70, 84, 98], [43, 57, 71, 85, 99], [44, 58, 72, 86, 100],  
 [49, 63, 77, 91, 105], [50, 64, 78, 92, 106], [51, 65, 79, 93, 107], [52, 66, 80, 94, 108], [53, 67, 81, 95, 109], [54, 68, 82, 96, 110], [55, 69, 83, 97, 111], [56, 70, 84, 98, 112], [57, 71, 85, 99, 113], [58, 72, 86, 100, 114], [59, 73, 87, 101, 115],  
 [64, 78, 92, 106, 120], [65, 79, 93, 107, 121], [66, 80, 94, 108, 122], [67, 81, 95, 109, 123], [68, 82, 96, 110, 124], [69, 83, 97, 111, 125], [70, 84, 98, 112, 126], [71, 85, 99, 113, 127], [72, 86, 100, 114, 128], [73, 87, 101, 115, 129], [74, 88, 102, 116, 130],  
 [79, 93, 107, 121, 135], [80, 94, 108, 122, 136], [81, 95, 109, 123, 137], [82, 96, 110, 124, 138], [83, 97, 111, 125, 139], [84, 98, 112, 126, 140], [85, 99, 113, 127, 141], [86, 100, 114, 128, 142], [87, 101, 115, 129, 143], [88, 102, 116, 130, 144], [89, 103, 117, 131, 145],  
 [94, 108, 122, 136, 150], [95, 109, 123, 137, 151], [96, 110, 124, 138, 152], [97, 111, 125, 139, 153], [98, 112, 126, 140, 154], [99, 113, 127, 141, 155], [100, 114, 128, 142, 156], [101, 115, 129, 143, 157], [102, 116, 130, 144, 158], [103, 117, 131, 145, 159], [104, 118, 132, 146, 160],  
 [109, 123, 137, 151, 165], [110, 124, 138, 152, 166], [111, 125, 139, 153, 167], [112, 126, 140, 154, 168], [113, 127, 141, 155, 169], [114, 128, 142, 156, 170], [115, 129, 143, 157, 171], [116, 130, 144, 158, 172], [117, 131, 145, 159, 173], [118, 132, 146, 160, 174], [119, 133, 147, 161, 175],  
 [124, 138, 152, 166, 180], [125, 139, 153, 167, 181], [126, 140, 154, 168, 182], [127, 141, 155, 169, 183], [128, 142, 156, 170, 184], [129, 143, 157, 171, 185], [130, 144, 158, 172, 186], [131, 145, 159, 173, 187], [132, 146, 160, 174, 188], [133, 147, 161, 175, 189], [134, 148, 162, 176, 190],  
 [139, 153, 167, 181, 195], [140, 154, 168, 182, 196], [141, 155, 169, 183, 197], [142, 156, 170, 184, 198], [143, 157, 171, 185, 199], [144, 158, 172, 186, 200], [145, 159, 173, 187, 201], [146, 160, 174, 188, 202], [147, 161, 175, 189, 203], [148, 162, 176, 190, 204], [149, 163, 177, 191, 205],  
 [154, 168, 182, 196, 210], [155, 169, 183, 197, 211], [156, 170, 184, 198, 212], [157, 171, 185, 199, 213], [158, 172, 186, 200, 214], [159, 173, 187, 201, 215], [160, 174, 188, 202, 216], [161, 175, 189, 203, 217], [162, 176, 190, 204, 218], [163, 177, 191, 205, 219], [164, 178, 192, 206, 220],  
# --------Total 572 --------------
]
		self.playerTurn = playerTurn
		self.binary = self._binary()
		self.id = self._convertStateToId()
		self.allowedActions = self._allowedActions()
		self.isEndGame = self._checkForEndGame()
		self.value = self._getValue()
		self.score = self._getScore()

	def _allowedActions(self):
		return np.where(self.board == 0)[0]
	# 	allowed = []
	# 	for i in range(len(self.board)):
	# 		if i >= len(self.board) - 7:
	# 			if self.board[i]==0:
	# 				allowed.append(i)
	# 		else:
	# 			if self.board[i] == 0 and self.board[i+7] != 0:
	# 				allowed.append(i)
	# 	return allowed

	def _binary(self):

		currentplayer_position = np.zeros(len(self.board), dtype=np.int)
		currentplayer_position[self.board==self.playerTurn] = 1

		other_position = np.zeros(len(self.board), dtype=np.int)
		other_position[self.board==-self.playerTurn] = 1

		position = np.append(currentplayer_position,other_position)

		return (position)

	def _convertStateToId(self):
		player1_position = np.zeros(len(self.board), dtype=np.int)
		player1_position[self.board==1] = 1

		other_position = np.zeros(len(self.board), dtype=np.int)
		other_position[self.board==-1] = 1

		position = np.append(player1_position,other_position)

		id = ''.join(map(str,position))

		return id

	def _checkForEndGame(self):
		if np.count_nonzero(self.board) == 15*15:
			return 1

		for x,y,z,a,b in self.winners:
			if (self.board[x] + self.board[y] + self.board[z] + self.board[a] +self.board[b] == 5 * -self.playerTurn):
				return 1
		return 0


	def _getValue(self):
		# This is the value of the state for the current player
		# i.e. if the previous player played a winning move, you lose
		for x,y,z,a, b in self.winners:
			if (self.board[x] + self.board[y] + self.board[z] + self.board[a] self.board[b] == 5 * -self.playerTurn):
				return (-1, -1, 1)
		return (0, 0, 0)


	def _getScore(self):
		tmp = self.value
		return (tmp[1], tmp[2])




	def takeAction(self, action):
		newBoard = np.array(self.board)
		newBoard[action]=self.playerTurn
		
		newState = GameState(newBoard, -self.playerTurn)

		value = 0
		done = 0

		if newState.isEndGame:
			value = newState.value[0]
			done = 1

		return (newState, value, done) 




	def render(self, logger):
		for r in range(15):
			logger.info([self.pieces[str(x)] for x in self.board[15*r : (15*r + 15)]])
		logger.info('--------------')