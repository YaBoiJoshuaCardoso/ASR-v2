import pandas as pd

def process_excel(file_path):
    df = pd.read_excel(file_path, header=None)
    df_transposed = df.T
    teachers_classes = {}
    for teacher in df_transposed.columns:
        teacher_name = df_transposed[teacher].iloc[0].lower().replace(' ', '_') + '_classes'
        classes = df_transposed[teacher].iloc[1:].tolist()
        teachers_classes[teacher_name] = classes
    return teachers_classes 