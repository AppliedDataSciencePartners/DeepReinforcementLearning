
def all_board(txt=None):
    """ For a 15x15 board, this will create a list numbering every board position
        If a parameter is passed, it will print that text with the position
        number inside of brackets. e.g. all_board('text') will give:
            text[0], text[1], text[2], ... text[223], text[224]
        If no parameter is passed, it simply lists the board position number.
        For ease of reading, we will create a new line for each board row
    """
    output = ''
    count = 0
    for j in range(15):
        for i in range(15):
            if txt == '0':
                output += '0, '
            elif txt:
                output += f'{txt}[{i+15*j}], '
                count += 1
            else:
                output += f'{i+15*j}, '
                count += 1
        output += ' \n'
    print(f'# -------- All Board: {txt} ----------------')
    print(output)
    print(f'# -------{txt}: {count} -----------------')


def win_combo():
    """ For a 15x15 board, with win condition of 5 in a row
        This generates all the win condition combos
    """
    h = 0
    v = 0
    dd = 0
    db = 0

    horiz = ''
    for j in range(0, 15*15, 15):
        for i in range(11):
            horiz += f'''[{i+j}, {i+1+j}, {i+2+j}, {i+3+j}, {i+4+j}], '''
            h += 1
        horiz += ' \n'
    vert = ''
    for j in range(0, 11*15, 15):
        for i in range(0, 15):
            vert += f'''[{i+j}, {i+15+j}, {i+30+j}, {i+45+j}, {i+60+j}], '''
            v += 1
        vert += ' \n'
    diag_down = ''
    for j in range(0, 11*15, 15):
        for i in range(11):
            diag_down += f'''[{i+j}, {i+15+1+j}, {i+30+2+j}, {i+45+3+j}, {i+60+4+j}], '''
            dd += 1
        diag_down += ' \n'
    diag_back = ''
    for j in range(0, 11*15, 15):
        for i in range(4, 15):
            diag_back += f'''[{i+j}, {i+15-1+j}, {i+30-2+j}, {i+45-3+j}, {i+60-4+j}], '''
            db += 1
        diag_back += ' \n'
    # 0 to 10, next five spots are win
    # above plus 15, same 
    print(f'# --------Horiz: {h} --------------')
    print(horiz)
    print(f'# --------Vert: {v} --------------')
    print(vert)
    print(f'# --------Diag_Down {dd} --------------')
    print(diag_down)
    print(f'# --------Diag_Back {db} --------------')
    print(diag_back)    
    ttl = h + v + dd + db
    print(f'# --------Total {ttl} --------------')


if __name__ == '__main__':
    inp = input('Which Array :>')
    if inp == 'win':
        win_combo()
    param = ''
    command, *param = inp.split()
    if len(param):
        param = '_'.join(param)
    else:
        param = ''
    if command == 'all':
        all_board(param)
